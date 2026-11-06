// IDE frame v2 — the shared frame graphl-flow 0.10+ defines (dev/fixtures/studies/ide-frame.ts) and
// typescript-diagram-engine authors every step section in:
//
//   [explorer] | editor (EDITOR_ROWS[v])                     | side pane, TITLED with the section's
//              | terminal docked under it (the rest)          | mental model: one diagram, ≤ 1 table
//
// One 1344 × 756 grid at a 1% margin: every v2 frame lands on ONE fit (check-render asserts it, per
// frame kind, while courses migrate from the v1 template in ide.ts). Every column is a FIXED width,
// so content wider than its column overflows (check-render fails it) instead of moving the frame.
// Two variants of one height: `code`, a tall editor over a short terminal, and `run`, a short editor
// over a tall terminal, picked from the transcript's length. The terminal is 72 columns: the
// recorded sessions (80 columns) are wrapped here, at draw time, so the spine is untouched.
//
// The workbench's id is `ide-bench` (v1's is `workbench`): that is how the checks tell the two apart.
import type { Code, Edge, Group, SceneModel, SceneNode, Tree, TreeEntry } from '@graphlearning/graphl-flow'
import { trim } from './ide'

const ROW = 24
const CHROME = 51
export const GAP = 10
export const FULL_W = 1344
export const FRAME_H = Math.round(FULL_W / (16 / 9))
export const SIDE_W = 434
export const WORK_W = 715
export const EXPLORER_W = FULL_W - (WORK_W + GAP + SIDE_W) - GAP
/** The terminal's width in columns, and the editor's soft-wrap point (it wraps a 72-column line). */
export const COLS = 72
const EDITOR_WRAP = 71

export type Variant = 'code' | 'run'
export const EDITOR_ROWS: Record<Variant, number> = { code: 18, run: 9 }
const editorH = (v: Variant) => EDITOR_ROWS[v] * ROW + CHROME
const panelH = (v: Variant) => FRAME_H - GAP - editorH(v)
/** Terminal rows a variant shows with the explorer beside it. */
export const terminalRows = (v: Variant) => Math.floor((panelH(v) - CHROME) / ROW)

/**
 * A spine session.txt as terminal rows: `$ cmd` and the REPL's `>>>` / `...` lines are commands, a
 * traceback (its header through the exception line that ends it) is marked `! ` as an error, and a
 * line longer than COLS wraps as a real 72-column terminal wraps it — each piece one row.
 */
export function terminal(session: string): string {
  const out: string[] = []
  let inError = false
  for (const line of trim(session).split('\n')) {
    if (line.startsWith('$ ') || line.startsWith('>>> ') || line.startsWith('... ') || line.startsWith('expense> ')) inError = false
    else if (!inError && (line === 'Traceback (most recent call last):' || /^ {2}File ".*", line \d+/.test(line))) inError = true
    const rows = line.match(new RegExp(`.{1,${COLS}}`, 'g')) ?? ['']
    if (inError) {
      out.push(...rows.map((row) => `! ${row}`))
      if (/^[A-Za-z_][\w.]*(Error|Exception|Warning|Interrupt|Exit)\b/.test(line)) inError = false
    } else out.push(...rows)
  }
  return out.join('\n')
}

const rowsOf = (lines: string[], a: number, b: number) =>
  lines.slice(a - 1, b).reduce((n, l) => n + Math.max(1, Math.ceil(l.length / EDITOR_WRAP)), 0)

/** A window of the file around lines first..last that fits `room` editor rows, folds included. */
export function windowFor(code: string, first: number, last: number, room: number): [number, number][] | undefined {
  const lines = trim(code).split('\n')
  if (rowsOf(lines, 1, lines.length) <= room) return undefined
  const fits = (a: number, b: number) => rowsOf(lines, a, b) + (a > 1 ? 1 : 0) + (b < lines.length ? 1 : 0) <= room
  if (!fits(first, last)) throw new Error(`frame.ts: lines ${first}–${last} do not fit ${room} rows`)
  let a = first, b = last
  for (let grew = true; grew;) {
    grew = false
    if (a > 1 && fits(a - 1, b)) { a--; grew = true }
    if (b < lines.length && fits(a, b + 1)) { b++; grew = true }
  }
  return [[a, b]]
}

export interface Frame {
  /** The side pane's title: the section's mental model, in a few words. */
  model: string
  tree: TreeEntry[]
  /** The file in the editor; `highlight` lines are found by text by the caller (lineOf). */
  editor: { file: string; code: string; highlight?: number[]; show?: [number, number][]; lang?: Code['lang'] }
  /** The step's session.txt, raw. */
  session: string
  /** The mental model: one diagram, at most one table (check-content holds it to that). */
  side: SceneNode[]
  /** Edges between nodes INSIDE the side pane only. */
  edges?: Edge[]
  variant?: Variant
  project?: string
}

export function ideFrame2({ model, tree, editor, session, side, edges = [], variant, project = 'expense-tracker' }: Frame): SceneModel {
  const term = terminal(session)
  const rows = term.split('\n').length
  const v: Variant = variant ?? (rows > terminalRows('code') ? 'run' : 'code')
  if (rows > terminalRows(v)) throw new Error(`frame.ts "${model}": the transcript is ${rows} rows, the ${v} terminal shows ${terminalRows(v)}`)
  const code = trim(editor.code)
  const hl = editor.highlight ?? []
  let show: [number, number][] | undefined
  try {
    show = editor.show ?? (hl.length ? windowFor(code, Math.min(...hl), Math.max(...hl), EDITOR_ROWS[v]) : windowFor(code, 1, 1, EDITOR_ROWS[v]))
  } catch (e) {
    throw new Error(`"${model}": ${(e as Error).message}`)
  }
  const ed: Code = {
    type: 'code', id: 'editor', filename: editor.file, lang: editor.lang ?? 'python', code, highlight: hl, wrap: true,
    tone: 'ingest', fill: true, w: WORK_W, minH: editorH(v), ...(show && { show }),
  }
  const tm: Code = { type: 'code', id: 'terminal', terminal: true, filename: `terminal — ${project}`, code: term, fill: true, w: WORK_W, minH: panelH(v) }
  const explorer: Tree = { type: 'tree', id: 'explorer', title: project, entries: tree, compact: true, fill: true, w: EXPLORER_W, minH: FRAME_H }
  const pane: Group = { type: 'group', id: 'side', title: model, tone: 'ingest', spread: true, w: SIDE_W, minH: FRAME_H, children: side }
  return { dir: 'row', padding: 0.01, nodes: [explorer, { type: 'group', id: 'ide-bench', bare: true, children: [ed, tm] }, pane], edges }
}
