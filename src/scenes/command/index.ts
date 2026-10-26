import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, linesFrom } from '../ide'
import { view } from '../fold'
import { outputOf } from '../lab'
import { appMap } from '../map'
import { venvClosed } from '../start/tree'
import c1 from '../../../spine/command/01-modules/project/main.py?raw'
import s1 from '../../../spine/command/01-modules/session.txt?raw'
import c2 from '../../../spine/command/02-packages/project/expense_tracker/__main__.py?raw'
import s2 from '../../../spine/command/02-packages/session.txt?raw'
import c3 from '../../../spine/command/03-argparse/project/expense_tracker/cli.py?raw'
import s3 from '../../../spine/command/03-argparse/session.txt?raw'
import s4 from '../../../spine/command/04-the-whole-app/session.txt?raw'

// Course 7 — a real command. Values are the sessions' output.
const data: TreeEntry = { name: 'data', children: [{ name: 'bank', folder: true }, { name: 'expenses.json' }] }
const modules = ['bank.py', 'categorise.py', 'money.py', 'report.py', 'store.py']
const pkg = (extra: TreeEntry[] = [], active = '__main__.py', fresh = false): TreeEntry => ({
  name: 'expense_tracker', state: fresh ? 'new' : undefined, children: [
    { name: '__init__.py' }, { name: '__main__.py', state: active === '__main__.py' ? 'active' : undefined }, ...extra,
    ...modules.map((m): TreeEntry => ({ name: m })),
  ],
})

// §1 — modules ◆ what import runs; lazy import.
const modules1 = ideFrame({
  tree: [venvClosed, data, ...modules.map((m): TreeEntry => ({ name: m, state: 'new' })), { name: 'main.py', state: 'active' }],
  editor: { file: 'main.py', code: c1, ...view(c1, '# expense-tracker'), highlight: linesFrom(c1, 'from categorise import', 'lazy import bank') }, session: s1,
  side: [
    {
      type: 'group', id: 'graph', title: 'main.py imports', icon: 'workflow', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'main', title: 'main.py', sub: 'the loop, ~70 lines', icon: 'python' },
        { type: 'group', id: 'mods', bare: true, children: [
          { type: 'table', id: 'eager', title: 'imported at start', tone: 'store', rows: [['categorise'], ['money'], ['report'], ['store']] },
          { type: 'table', id: 'lazy', title: 'lazy import (3.15)', tone: 'consume', rows: [['bank: on first use']] },
        ] },
      ],
    },
    {
      type: 'table', id: 'mods-in', title: 'sys.modules (the REPL)', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        ['"report" in sys.modules', 'True'], { id: 'b1', cells: ['"bank" in sys.modules', 'False: not yet'], tone: 'consume' },
        ['bank.InvalidRow', "<class 'bank.InvalidRow'>"], { id: 'b2', cells: ['"bank" in sys.modules', 'True: loaded'], tone: 'store' },
      ],
    },
    { type: 'item', id: 'cap', title: 'What import does', icon: 'python', tone: 'ingest', bullets: ['runs the module once, top to bottom', 'then caches it in sys.modules'] },
    { type: 'table', id: 'split', title: 'One subject per module', tone: 'store', columns: ['module', 'holds'], rows: [['store', 'paths, load, save, bank_rows'], ['report', 'budgets, dates, the table']] },
    { type: 'note', id: 'm-note', tone: 'ingest', text: 'Each module has its own globals, so functions now take expenses as an argument instead of reaching for a global.' },
  ],
  edges: [{ from: 'main', to: 'eager' }, { from: 'main', to: 'lazy', dashed: true }],
})

// §2 — packages and __main__: two ways in, one main().
const packages2 = ideFrame({
  tree: [venvClosed, data, pkg([], '__main__.py', true), { name: 'main.py' }],
  editor: { file: 'expense_tracker/__main__.py', code: c2, ...view(c2, 'def main():', undefined, 8), highlight: [lineOf(c2, 'def main():'), ...linesFrom(c2, 'if __name__ ==', 'main()')].filter((n, i, a) => a.indexOf(n) === i) }, session: s2,
  side: [
    {
      type: 'group', id: 'ways', title: 'Two ways in', icon: 'workflow', tone: 'ingest', dir: 'row', children: [
        { type: 'group', id: 'entries', bare: true, children: [
          { type: 'item', id: 'dash-m', title: 'python -m expense_tracker', sub: '__name__ == "__main__"', icon: 'terminal' },
          { type: 'item', id: 'shim', title: 'python main.py', sub: 'the shim imports main', icon: 'file' },
        ] },
        { type: 'item', id: 'main-fn', title: 'main()', icon: 'python', tone: 'store', bullets: ['expenses = load()', 'then the command loop'] },
      ],
    },
    {
      type: 'table', id: 'names', title: 'Names with - and _', tone: 'consume', columns: ['', 'written'], rows: [
        ['the project, the folder', 'expense-tracker'], { id: 'pkgname', cells: ['the package you import', 'expense_tracker'], tone: 'store' },
        { id: 'bad', cells: ['import expense-tracker', 'SyntaxError: - is minus'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'rel', title: 'Inside the package', tone: 'ingest', columns: ['written', 'means'], rows: [
        ['from .money import parse_amount', 'money, in this package'], ['lazy from . import bank', 'bank, when first used'],
      ],
    },
    { type: 'table', id: 'ran', title: 'python -m expense_tracker', tone: 'store', rows: [['expense> recent 7'], ['2 expenses, 35.20 in 7 days']] },
    { type: 'item', id: 'cap', title: 'The guard', icon: 'shield', tone: 'ingest', bullets: ['run: __name__ is "__main__"', 'imported: it is the module name'] },
    { type: 'note', id: 'p-note', tone: 'ingest', text: 'A package is a folder with __init__.py. __main__.py is what python -m runs; the guard keeps an import from starting the loop.' },
  ],
  edges: [{ from: 'dash-m', to: 'main-fn' }, { from: 'shim', to: 'main-fn' }],
})

// §3 — argparse: argv → the parser → the call it makes.
const argparse3 = ideFrame({
  tree: [venvClosed, data, pkg([{ name: 'cli.py', state: 'new' }], 'cli.py'), { name: 'main.py' }],
  editor: { file: 'expense_tracker/cli.py', code: c3, ...view(c3, 'def parser():', 'return p', 10), highlight: linesFrom(c3, 'month = commands.add_parser', 'month.add_argument') }, session: s3,
  side: [
    {
      type: 'group', id: 'flow', title: 'python -m expense_tracker report --month 2026-09', icon: 'terminal', tone: 'ingest', children: [
        { type: 'item', id: 'argv', title: "sys.argv[1:]", sub: "['report', '--month', '2026-09']", icon: 'terminal' },
        { type: 'item', id: 'parse', title: 'parser().parse_args()', sub: "Namespace(command='report', month='2026-09')", icon: 'filter' },
        { type: 'item', id: 'call', title: "run(…) → report(expenses, '2026-09')", sub: 'September: food 16%, bills 27%', icon: 'chart', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'cmds', title: 'One command per run', tone: 'ingest', columns: ['command', 'arguments'], rows: [
        ['add', 'AMOUNT CATEGORY [NOTE…]'], ['report', '[--month YYYY-MM]'], ['list', 'CATEGORY'], ['recent', 'DAYS (an int)'], ['import, top, recurring, …', 'none'],
      ],
    },
    { type: 'table', id: 'bad', title: 'add 12,50 food', tone: 'consume', rows: [["not added: not a number: '12,50'"]] },
    { type: 'item', id: 'cap', title: 'Free with argparse', icon: 'terminal', tone: 'ingest', bullets: ['--help for every command', 'errors that name the problem'] },
    { type: 'note', id: 'a-note', tone: 'store', text: 'A command that changes the expenses saves them before the process ends: each run is a whole, small program.' },
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
