import { EDITOR_ROWS, lineOf, lastLine } from './ide'

/**
 * Fold a file longer than the editor to the region a section is about: lines 1–`head` (the file's
 * header), then from the line containing `first` through the line containing `last` (or as far as
 * the editor allows). Found by TEXT, like every highlight. Each skipped run is one fold row, and
 * the result never exceeds EDITOR_ROWS — check-content would fail it.
 */
export function view(code: string, first: string, last?: string, head = 2): { show: [number, number][] } {
  const n = lastLine(code)
  if (n <= EDITOR_ROWS) return { show: [[1, n]] }
  const a = lineOf(code, first)
  const lead: [number, number][] = a > head + 1 ? [[1, head]] : []
  const used = lead.length ? head + 1 : 0
  const room = EDITOR_ROWS - used - 1 // the trailing fold row, if any
  const want = last ? lineOf(code, last, a) : n
  const b = Math.min(want, a + room - 1, n)
  const start = lead.length ? a : 1
  return { show: [...lead, [start, b === n - 1 ? n : b]] }
}
