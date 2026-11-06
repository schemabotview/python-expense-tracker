import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { outputOf } from '../lab'
import { appMap } from '../map'
import c1 from '../../../spine/command/01-modules/project/main.py?raw'
import s1 from '../../../spine/command/01-modules/session.txt?raw'
import c2 from '../../../spine/command/02-packages/project/expense_tracker/__main__.py?raw'
import s2 from '../../../spine/command/02-packages/session.txt?raw'
import c3 from '../../../spine/command/03-argparse/project/expense_tracker/cli.py?raw'
import s3 from '../../../spine/command/03-argparse/session.txt?raw'
import s4 from '../../../spine/command/04-the-whole-app/session.txt?raw'

// Course 7 — a real command, on IDE frame v2 (each side pane: the section's mental model as its
// title, one diagram, at most one table). Values are the sessions' output.
const venvClosed: TreeEntry = { name: '.venv', folder: true, state: 'muted' }
const data: TreeEntry = { name: 'data', children: [{ name: 'bank', folder: true }, { name: 'expenses.json' }] }
const modules = ['bank.py', 'categorise.py', 'money.py', 'report.py', 'store.py']
const pkg = (extra: TreeEntry[] = [], active = '__main__.py', fresh = false): TreeEntry => ({
  name: 'expense_tracker', state: fresh ? 'new' : undefined, children: [
    { name: '__init__.py' }, { name: '__main__.py', state: active === '__main__.py' ? 'active' : undefined }, ...extra,
    ...modules.map((m): TreeEntry => ({ name: m })),
  ],
})

// §1 — modules ◆ what import runs; lazy import.
const modules1 = ideFrame2({
  model: 'import runs a module once, then caches it',
  tree: [venvClosed, data, ...modules.map((m): TreeEntry => ({ name: m, state: 'new' })), { name: 'main.py', state: 'active' }],
  editor: { file: 'main.py', code: c1, highlight: linesFrom(c1, 'from categorise import', 'lazy import bank') }, session: s1,
  side: [
    {
      type: 'group', id: 'graph', title: 'main.py imports', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'main', title: 'main.py', sub: 'the loop, ~70 lines', icon: 'python' },
        { type: 'group', id: 'mods', bare: true, dir: 'row', children: [
          { type: 'table', id: 'eager', title: 'imported at start', tone: 'store', rows: [['categorise'], ['money'], ['report'], ['store']] },
          { type: 'table', id: 'lazy', title: 'lazy (3.15)', tone: 'consume', rows: [['bank'], ['on first use']] },
        ] },
      ],
    },
    {
      type: 'table', id: 'mods-in', title: 'sys.modules, before and after bank is used', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        ['"report" in sys.modules', 'True'], { id: 'b1', cells: ['"bank" in sys.modules', 'False'], tone: 'consume' },
        { id: 'b2', cells: ['"bank" in sys.modules', 'True'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'main', to: 'eager' }, { from: 'main', to: 'lazy', dashed: true }],
})

// §2 — packages and __main__: two ways in, one main().
const packages2 = ideFrame2({
  model: 'Two ways in, one main()',
  tree: [venvClosed, data, pkg([], '__main__.py', true), { name: 'main.py' }],
  editor: { file: 'expense_tracker/__main__.py', code: c2, highlight: [lineOf(c2, 'def main():'), lineOf(c2, 'if __name__ =='), lineOf(c2, 'if __name__ ==') + 1],
    // main() and the guard that calls it: the two ends of the file
    show: [[lineOf(c2, 'lazy from'), lineOf(c2, 'lazy from')], [lineOf(c2, 'def main():'), lineOf(c2, 'def main():') + 1], [lineOf(c2, 'if __name__ =='), lineOf(c2, 'if __name__ ==') + 1]] }, session: s2,
  side: [
    { type: 'item', id: 'dash-m', title: 'python -m expense_tracker', sub: 'runs __main__.py: __name__ == "__main__"', icon: 'terminal', tone: 'ingest' },
    { type: 'item', id: 'main-fn', title: 'main()', sub: 'load(), then the command loop', icon: 'python', tone: 'store' },
    { type: 'item', id: 'shim', title: 'python main.py', sub: 'the shim imports main and calls it', icon: 'file', tone: 'neutral' },
    {
      type: 'table', id: 'names', title: 'Names with - and _', tone: 'consume', columns: ['', 'written'], rows: [
        ['the folder', 'expense-tracker'], { id: 'pkgname', cells: ['the package', 'expense_tracker'], tone: 'store' },
        { id: 'bad', cells: ['import expense-tracker', 'SyntaxError'], tone: 'consume' },
      ],
    },
  ],
  edges: [{ from: 'dash-m', to: 'main-fn' }, { from: 'shim', to: 'main-fn' }],
})

// §3 — argparse: argv → the parser → the call it makes.
const argparse3 = ideFrame2({
  model: 'argv → the parser → one call',
  tree: [venvClosed, data, pkg([{ name: 'cli.py', state: 'new' }], 'cli.py'), { name: 'main.py' }],
  editor: { file: 'expense_tracker/cli.py', code: c3, highlight: linesFrom(c3, 'month = commands.add_parser', 'month.add_argument') }, session: s3,
  side: [
    { type: 'item', id: 'argv', title: "sys.argv[1:]", sub: "['report', '--month', '2026-09']", icon: 'terminal', tone: 'neutral' },
    { type: 'item', id: 'parse', title: 'parser().parse_args()', sub: "Namespace(command='report', month='2026-09')", icon: 'filter', tone: 'ingest' },
    { type: 'item', id: 'call', title: "run(…) → report(expenses, '2026-09')", sub: 'September: food 16%, bills 27%', icon: 'chart', tone: 'store' },
    {
      type: 'table', id: 'cmds', title: 'One command per run', tone: 'ingest', columns: ['command', 'arguments'], rows: [
        ['add', 'AMOUNT CATEGORY [NOTE…]'], ['report', '[--month YYYY-MM]'], ['list', 'CATEGORY'], ['recent', 'DAYS (an int)'], ['import, top, …', 'none'],
      ],
    },
  ],
  edges: [{ from: 'argv', to: 'parse' }, { from: 'parse', to: 'call' }],
})

// §4 — the whole app: the map, the script stages lit, and a real end-to-end run from a fresh
// data/expenses.json (the 8 hand-entered expenses).
const run = ['python -m expense_tracker import', 'python -m expense_tracker report', 'python -m expense_tracker recurring']
  .map((cmd) => `$ ${cmd}\n${outputOf(s4, cmd)}`).join('\n')
const whole4: SceneModel = appMap({
  title: 'The whole app',
  sub: 'Courses 2 to 7: a script became a package with a command line',
  built: 7,
  output: { type: 'code', id: 'out-run', terminal: true, filename: 'terminal: from 8 expenses to the report', code: run },
})

export const commandScenes: Record<string, SceneModel> = {
  'command-modules': modules1, 'command-packages': packages2, 'command-argparse': argparse3, 'command-the-whole-app': whole4,
}
