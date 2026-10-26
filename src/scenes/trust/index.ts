import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, linesFrom } from '../ide'
import { view } from '../fold'
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

// Course 9 — make it trustworthy. Values are the sessions' output.
const MODS = ['__init__.py', '__main__.py', 'bank.py', 'categorise.py', 'cli.py', 'errors.py', 'models.py', 'money.py', 'report.py', 'store.py']
const at = (f: string) => `expense_tracker/${f}`
const pyproject = (fresh = false): TreeEntry => ({ name: 'pyproject.toml', state: fresh ? 'new' : undefined })

// §1 — type hints, and mypy.
const hints1 = ideFrame({
  tree: pkgTree(MODS, 'cli.py', [], [pyproject(true)]), editor: { file: at('cli.py'), code: cli1, ...view(cli1, 'def main(', undefined, 0), highlight: [lineOf(cli1, 'with STORES[args.store]()')] }, session: s1,
  side: [
    {
      type: 'group', id: 'fn', title: 'A function, as its types', icon: 'code', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'ins', title: 'parameters', rows: [{ id: 'exp', cells: ['expenses: list[Expense]'] }, { id: 'mon', cells: ['month: str'] }] },
        { type: 'item', id: 'report', title: 'report(…)', icon: 'chart' },
        { type: 'table', id: 'outs', title: 'returns', rows: [['-> None']] },
      ],
    },
    {
      type: 'table', id: 'found', title: 'mypy: 2 errors in cli.py', tone: 'consume', columns: ['line 80', 'mypy says'], rows: [
        ['with STORES[…]()', '"object" has no attribute "__enter__"'], ['', '"object" has no attribute "__exit__"'],
      ],
    },
    {
      type: 'table', id: 'why', title: 'Why', tone: 'ingest', columns: ['STORES holds', 'mypy infers'], rows: [['JsonStore, SqliteStore', 'type[object]: their only common base']],
    },
    {
      type: 'table', id: 'pyproject', title: 'pyproject.toml: the dev tools, pinned', tone: 'store', columns: ['tool', 'version', 'for'], rows: [
        ['mypy', '2.4.0', 'types'], ['pytest', '9.1.1', 'tests'], ['ruff', '0.17.2', 'style'],
      ],
    },
    { type: 'item', id: 'cap', title: 'Hints are for tools', icon: 'code', tone: 'ingest', bullets: ['Python ignores them when it runs', 'mypy checks them without running'] },
    { type: 'note', id: 'h-note', tone: 'consume', text: 'The program runs, so no test would see it. The Store protocol exists, but nothing tells mypy STORES holds Stores. The fix is one annotation.' },
  ],
  edges: [{ from: 'ins', to: 'report' }, { from: 'report', to: 'outs' }],
})

// §2 — pytest.
const pytest2 = ideFrame({
  tree: pkgTree(MODS, 'test_money.py', ['__init__.py', 'test_categorise.py', 'test_money.py'], [pyproject()], ['__init__.py', 'test_categorise.py', 'test_money.py']),
  editor: { file: 'tests/test_money.py', code: tm2, ...view(tm2, 'import pytest', undefined, 0), highlight: linesFrom(tm2, 'def test_adding_money', 'assert total ==') }, session: s2,
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
    { type: 'table', id: 'mypy', title: 'mypy, after the fix', tone: 'store', rows: [['STORES: dict[str, type[Store]]'], ['Success: no issues found in 10 source files']] },
    { type: 'item', id: 'cap', title: 'Types and tests', icon: 'shield', tone: 'ingest', bullets: ['mypy: do the pieces fit?', 'pytest: do they do the right thing?'] },
    { type: 'note', id: 't-note', tone: 'ingest', text: 'pytest finds files and functions named test_, runs each, and reports. pytest.raises checks that an error IS raised.' },
  ],
  edges: [{ from: 't', to: 'u', label: 'calls' }, { from: 'u', to: 'a' }],
})

// §3 — fixtures and parametrisation.
const fixtures3 = ideFrame({
  tree: pkgTree(MODS, 'test_bank.py', ['test_bank.py'], [pyproject()], ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_money.py']),
  editor: { file: 'tests/test_bank.py', code: tb3, ...view(tb3, '@pytest.fixture', 'validate(GOOD | change', 0), highlight: linesFrom(tb3, '@pytest.fixture', 'validate(GOOD | change') }, session: s3,
  side: [
    {
      type: 'group', id: 'fan', title: 'One test function, four cases', icon: 'workflow', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'fn', title: 'test_a_bad_row_is_refused', icon: 'code', bullets: ['@parametrize: 4 cases', 'seen: a fixture'] },
        { type: 'table', id: 'cases', title: 'collected as', rows: [{ id: 'c0', cells: ['[change0-not a number]'] }, { id: 'c1', cells: ['[change1-no date]'] }, { id: 'c2', cells: ['[change2-more than zero]'] }, { id: 'c3', cells: ['[change3-needs a rate]'] }] },
      ],
    },
    {
      type: 'table', id: 'fixture', title: 'The fixture seen', tone: 'store', columns: ['asked for by', 'gets'], rows: [['every test with a seen parameter', 'a fresh set()'], ['so no test', 'sees another\'s rows']],
    },
    { type: 'table', id: 'run', title: 'pytest -q', tone: 'store', rows: [['12 passed']] },
    {
      type: 'table', id: 'others', title: 'The other two tests in the file', tone: 'ingest', columns: ['test', 'checks'], rows: [
        ['a good row is categorised', 'TESCO… → Category.FOOD'], ['the same row twice', 'the second is a duplicate'],
      ],
    },
    { type: 'item', id: 'cap', title: 'Tests as data', icon: 'table', tone: 'store', bullets: ['one function, a list of cases', 'each case named in the report'] },
    { type: 'note', id: 'f-note', tone: 'ingest', text: 'GOOD | change merges two dicts: a good row with one field broken. Each bad row from Ana\'s export becomes one line of data.' },
  ],
  edges: [{ from: 'fn', to: 'cases', label: '4 ×' }],
})

// §4 — test doubles: a fake Store.
const fakes4 = ideFrame({
  tree: pkgTree(MODS, 'test_cli.py', ['test_cli.py'], [pyproject()], ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_cli.py', 'test_money.py']),
  editor: { file: 'tests/test_cli.py', code: tc4, ...view(tc4, 'class FakeStore:', 'assert capsys.readouterr()', 0), highlight: linesFrom(tc4, 'class FakeStore:', 'self.saved = expenses') }, session: s4,
  side: [
    {
      type: 'group', id: 'shape', title: 'Store: load() and save(…)', icon: 'database', tone: 'ingest', children: [
        { type: 'item', id: 'main', title: 'cli.main(["add", "3.20", "food", "bakery"])', icon: 'terminal' },
        { type: 'group', id: 'impls', bare: true, dir: 'row', children: [
          { type: 'item', id: 'real', title: 'JsonStore', sub: 'the app', icon: 'file' },
          { type: 'item', id: 'fake', title: 'FakeStore', sub: 'the test: in memory', icon: 'boxes', tone: 'store' },
        ] },
      ],
    },
    {
      type: 'table', id: 'checks', title: 'What the tests check', tone: 'ingest', columns: ['test', 'asserts'], rows: [
        ['add saves through the store', 'saved == [bakery]'], ['a refused add saves nothing', 'saved is None'], ['recent counts back from today', 'TODAY patched to 10-10'],
      ],
    },
    { type: 'table', id: 'run', title: 'pytest -q', tone: 'store', rows: [['3 passed: tests/test_cli.py'], ['15 passed: everything']] },
    { type: 'table', id: 'mp', title: 'monkeypatch, for one test', tone: 'ingest', columns: ['call', 'swaps'], rows: [['setitem(cli.STORES, "json", …)', 'the store'], ['setattr(report, "TODAY", …)', 'the clock']] },
    { type: 'item', id: 'cap', title: 'Fake only the edges', icon: 'shield', tone: 'store', bullets: ['files, the network, the clock', 'everything inside runs for real'] },
    { type: 'note', id: 'k-note', tone: 'ingest', text: 'monkeypatch swaps STORES["json"] and report.TODAY for one test, then puts them back. The Protocol is what makes a fake possible.' },
  ],
  edges: [{ from: 'main', to: 'real', dashed: true }, { from: 'main', to: 'fake' }],
})

// §5 — logging.
const logging5 = ideFrame({
  tree: pkgTree(MODS, 'bank.py', [], [pyproject()], ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_cli.py', 'test_money.py']),
  editor: { file: at('bank.py'), code: b5, ...view(b5, 'import logging', 'log = logging.getLogger', 0), highlight: [lineOf(b5, 'log = logging.getLogger'), lineOf(b5, 'log.warning(')] }, session: s5,
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
    { type: 'item', id: 'cap', title: 'print or log?', icon: 'terminal', tone: 'ingest', bullets: ['print: the answer Ana asked for', 'log: how the app got there'] },
    { type: 'table', id: 'out', title: '-v top', tone: 'store', rows: [['DEBUG expense_tracker.store: loaded 20 expenses …'], ['2026-10-04 Train to Porto 68.40 GBP transport']] },
    { type: 'note', id: 'l-note', tone: 'ingest', text: 'Logs go to stderr, so a report piped to a file stays clean, and -v turns the details on without changing any code.' },
  ],
  edges: [{ from: 'logger', to: 'level' }, { from: 'level', to: 'handler' }],
})

// §6 — decorators and closures.
const deco6 = ideFrame({
  tree: pkgTree([...MODS, 'timing.py'].sort(), 'timing.py', ['timing.py'], [pyproject()], ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_cli.py', 'test_money.py']),
  editor: { file: at('timing.py'), code: t6, highlight: linesFrom(t6, 'def timed[', 'return wrapper') }, session: s6,
  side: [
    {
      type: 'group', id: 'after', title: '@timed above def report: report = timed(report)', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        obj('wrapper', 'report → function wrapper', [{ id: 'cell', cells: ['closure cell', '●'] }, ['__name__', "'report'"]], 'store'),
        obj('original', 'the original report', [['prints'], ['the table']]),
      ],
    },
    {
      type: 'table', id: 'ran', title: '-v report', tone: 'store', rows: [[s6.match(/DEBUG expense_tracker\.timing: .*/)![0]]],
    },
    {
      type: 'table', id: 'wraps', title: 'functools.wraps kept its identity', tone: 'ingest', columns: ['asked', 'answer'], rows: [['report.__name__', "'report'"], ['report.__wrapped__', '<function report …>']],
    },
    { type: 'table', id: 'sugar', title: 'The @ is shorthand', tone: 'ingest', columns: ['written', 'means'], rows: [['@timed', 'report = timed(report)'], ['def timed[**P, R]', 'same arguments, same result type']] },
    { type: 'item', id: 'cap', title: 'Decorators you have used', icon: 'code', tone: 'store', bullets: ['@dataclass, @property', '@pytest.fixture, @classmethod', '@functools.wraps, inside timed'] },
    { type: 'item', id: 'cap2', title: 'Timings vary', icon: 'clock', tone: 'ingest', bullets: ['one machine, one build: CPython 3.15.1'] },
    { type: 'note', id: 'd-note', tone: 'ingest', text: 'A closure: wrapper keeps the function it was made with, after timed has returned. The timing on this build is CPython 3.15.1\'s, and varies run to run.' },
  ],
  edges: [{ from: 'wrapper.cell', to: 'original' }],
})

export const trustScenes: Record<string, SceneModel> = {
  'trust-type-hints': hints1, 'trust-pytest': pytest2, 'trust-fixtures': fixtures3, 'trust-fakes': fakes4, 'trust-logging': logging5, 'trust-decorators': deco6,
}
