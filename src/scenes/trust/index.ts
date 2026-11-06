import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { obj } from '../mem'
import { pkgTree } from '../pkgtree'
import cli1 from '../../../spine/trust/01-type-hints/project/expense_tracker/cli.py?raw'
import s1 from '../../../spine/trust/01-type-hints/session.txt?raw'
import tm2 from '../../../spine/trust/02-pytest/project/tests/test_money.py?raw'
import s2 from '../../../spine/trust/02-pytest/session.txt?raw'
import tb3 from '../../../spine/trust/03-fixtures/project/tests/test_bank.py?raw'
import s3 from '../../../spine/trust/03-fixtures/session.txt?raw'
import tc4 from '../../../spine/trust/04-fakes/project/tests/test_cli.py?raw'
import s4 from '../../../spine/trust/04-fakes/session.txt?raw'
import b5 from '../../../spine/trust/05-logging/project/expense_tracker/bank.py?raw'
import s5 from '../../../spine/trust/05-logging/session.txt?raw'
import t6 from '../../../spine/trust/06-decorators/project/expense_tracker/timing.py?raw'
import s6 from '../../../spine/trust/06-decorators/session.txt?raw'

// Course 9 — make it trustworthy, on IDE frame v2 (each side pane: the section's mental model as
// its title, one diagram, at most one table). Values are the sessions' output.
const MODS = ['__init__.py', '__main__.py', 'bank.py', 'categorise.py', 'cli.py', 'errors.py', 'models.py', 'money.py', 'report.py', 'store.py']
const at = (f: string) => `expense_tracker/${f}`
const pyproject = (fresh = false): TreeEntry => ({ name: 'pyproject.toml', state: fresh ? 'new' : undefined })

// §1 — type hints, and mypy.
const hints1 = ideFrame2({
  model: 'A function, as its types', tree: pkgTree(MODS, 'cli.py', [], [pyproject(true)]), editor: { file: at('cli.py'), code: cli1, highlight: [lineOf(cli1, 'with STORES[args.store]()')] }, session: s1,
  side: [
    {
      type: 'group', id: 'fn', title: 'def report(expenses, month)', icon: 'code', tone: 'ingest', children: [
        { type: 'table', id: 'ins', title: 'parameters', rows: [{ id: 'exp', cells: ['expenses: list[Expense]'] }, { id: 'mon', cells: ['month: str'] }] },
        { type: 'item', id: 'report', title: 'report(…)', sub: 'mypy checks every call against these', icon: 'chart' },
        { type: 'table', id: 'outs', title: 'returns', rows: [['-> None']] },
      ],
    },
    {
      type: 'table', id: 'pyproject', title: 'pyproject.toml: the dev tools, pinned', tone: 'store', columns: ['tool', 'version', 'for'], rows: [
        ['mypy', '2.4.0', 'types'], ['pytest', '9.1.1', 'tests'], ['ruff', '0.17.2', 'style'],
      ],
    },
  ],
  edges: [{ from: 'ins', to: 'report' }, { from: 'report', to: 'outs' }],
})

// §2 — pytest.
const pytest2 = ideFrame2({
  model: 'Call the unit; assert the result', tree: pkgTree(MODS, 'test_money.py', ['__init__.py', 'test_categorise.py', 'test_money.py'], [pyproject()], ['__init__.py', 'test_categorise.py', 'test_money.py']),
  editor: { file: 'tests/test_money.py', code: tm2, highlight: linesFrom(tm2, 'def test_adding_money', 'assert total ==') }, session: s2,
  side: [
    {
      type: 'group', id: 'loop', title: 'One test', icon: 'check', tone: 'ingest', children: [
        { type: 'item', id: 't', title: 'a function named test_…', sub: 'test_adding_money_…', icon: 'code' },
        { type: 'item', id: 'u', title: 'Money(4.50) + Money(12.99)', sub: 'the unit under test', icon: 'card' },
        { type: 'item', id: 'a', title: 'assert total == Money(17.49)', sub: 'pass, or a report of the difference', icon: 'shield', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'run', title: 'pytest', tone: 'store', columns: ['file', 'tests'], rows: [['tests/test_categorise.py', '2 passed'], ['tests/test_money.py', '4 passed']],
    },
  ],
  edges: [{ from: 't', to: 'u', label: 'calls' }, { from: 'u', to: 'a' }],
})

// §3 — fixtures and parametrisation.
const fixtures3 = ideFrame2({
  model: 'One test function, many cases', tree: pkgTree(MODS, 'test_bank.py', ['test_bank.py'], [pyproject()], ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_money.py']),
  editor: { file: 'tests/test_bank.py', code: tb3, highlight: linesFrom(tb3, '@pytest.mark.parametrize', 'def test_a_bad_row_is_refused') }, session: s3,
  side: [
    {
      type: 'group', id: 'fan', title: '@pytest.mark.parametrize', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'fn', title: 'test_a_bad_row_is_refused', sub: '4 cases; seen, a fixture', icon: 'code' },
        { type: 'table', id: 'cases', title: 'collected as', rows: [{ id: 'c0', cells: ['[change0-not a number]'] }, { id: 'c1', cells: ['[change1-no date]'] }, { id: 'c2', cells: ['[change2-more than zero]'] }, { id: 'c3', cells: ['[change3-needs a rate]'] }] },
      ],
    },
    {
      type: 'table', id: 'fixture', title: 'The fixture seen', tone: 'store', columns: ['asked for by', 'gets'], rows: [['a test asking for seen', 'a fresh set()'], ['so no test', "sees another's"]],
    },
  ],
  edges: [{ from: 'fn', to: 'cases', label: '4 ×' }],
})

// §4 — test doubles: a fake Store.
const fakes4 = ideFrame2({
  model: 'Fake only the edge: same shape, in memory', tree: pkgTree(MODS, 'test_cli.py', ['test_cli.py'], [pyproject()], ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_cli.py', 'test_money.py']),
  editor: { file: 'tests/test_cli.py', code: tc4, highlight: linesFrom(tc4, 'class FakeStore:', 'self.saved = expenses') }, session: s4,
  side: [
    {
      type: 'group', id: 'shape', title: 'Store: load() and save(…)', icon: 'database', tone: 'ingest', children: [
        { type: 'item', id: 'main', title: 'cli.main(["add", "3.20", …])', sub: 'calls store.load(), then store.save(…)', icon: 'terminal' },
        { type: 'group', id: 'impls', bare: true, dir: 'row', children: [
          { type: 'item', id: 'real', title: 'JsonStore', sub: 'the app', icon: 'file' },
          { type: 'item', id: 'fake', title: 'FakeStore', sub: 'the test: in memory, keeps what was saved', icon: 'boxes', tone: 'store' },
        ] },
      ],
    },
    { type: 'table', id: 'run', title: 'pytest -q', tone: 'store', rows: [['3 passed: tests/test_cli.py'], ['15 passed: everything']] },
  ],
  edges: [{ from: 'main', to: 'real', dashed: true }, { from: 'main', to: 'fake' }],
})

// §5 — logging.
const logging5 = ideFrame2({
  model: 'logger → level → handler', tree: pkgTree(MODS, 'bank.py', [], [pyproject()], ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_cli.py', 'test_money.py']),
  editor: { file: at('bank.py'), code: b5, highlight: [lineOf(b5, 'log = logging.getLogger'), lineOf(b5, 'log.warning(')],
    show: [[lineOf(b5, 'log = logging.getLogger'), lineOf(b5, 'log = logging.getLogger')], [lineOf(b5, 'log.warning(') - 3, lineOf(b5, 'log.warning(') + 1]] }, session: s5,
  side: [
    {
      type: 'group', id: 'pipe', title: 'log.warning("%s line %d: %s", …)', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'logger', title: 'logger expense_tracker.bank', sub: 'named after its module', icon: 'file' },
        { type: 'item', id: 'level', title: 'level: WARNING, or DEBUG with -v', sub: 'set once, in cli.main', icon: 'filter' },
        { type: 'item', id: 'handler', title: 'handler → stderr', sub: '%(levelname)s %(name)s: %(message)s', icon: 'terminal', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'levels', title: 'Levels used', tone: 'ingest', columns: ['level', 'for', 'shown'], rows: [
        ['DEBUG', 'loaded 20 expenses', 'with -v'], { id: 'warn', cells: ['WARNING', 'a rejected row', 'always'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'logger', to: 'level' }, { from: 'level', to: 'handler' }],
})

// §6 — decorators and closures.
const deco6 = ideFrame2({
  model: 'A wrapper that keeps the function it wraps', tree: pkgTree([...MODS, 'timing.py'].sort(), 'timing.py', ['timing.py'], [pyproject()], ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_cli.py', 'test_money.py']),
  editor: { file: at('timing.py'), code: t6, highlight: [lineOf(t6, 'def timed['), lineOf(t6, 'def wrapper('), lineOf(t6, 'return function('), lineOf(t6, 'return wrapper')],
    // timed, the wrapper it makes, the call through the closure, and the return
    show: [[lineOf(t6, 'def timed['), lineOf(t6, 'def wrapper(')], [lineOf(t6, 'return function('), lineOf(t6, 'return function(')], [lineOf(t6, 'return wrapper'), lineOf(t6, 'return wrapper')]] }, session: s6,
  side: [
    { type: 'item', id: 'call', icon: 'terminal', tone: 'neutral', title: 'report(expenses, month)', sub: 'runs wrapper: it times the original' },
    {
      type: 'group', id: 'after', title: '@timed: report = timed(report)', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        obj('wrapper', 'report: now wrapper', [{ id: 'cell', cells: ['closure cell', '●'] }, ['__name__', "'report'"]], 'store'),
        obj('original', 'the original', [['prints'], ['the table']]),
      ],
    },
    {
      type: 'table', id: 'wraps', title: 'functools.wraps kept its identity', tone: 'ingest', columns: ['asked', 'answer'], rows: [['report.__name__', "'report'"], ['report.__wrapped__', '<function report …>']],
    },
  ],
  edges: [{ from: 'call', to: 'after' }, { from: 'wrapper.cell', to: 'original' }],
})

export const trustScenes: Record<string, SceneModel> = {
  'trust-type-hints': hints1, 'trust-pytest': pytest2, 'trust-fixtures': fixtures3, 'trust-fakes': fakes4, 'trust-logging': logging5, 'trust-decorators': deco6,
}
