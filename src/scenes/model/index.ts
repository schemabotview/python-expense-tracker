import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { names, obj } from '../mem'
import { pkgTree } from '../pkgtree'
import m1 from '../../../spine/model/01-classes/project/expense_tracker/models.py?raw'
import s1 from '../../../spine/model/01-classes/session.txt?raw'
import m2 from '../../../spine/model/02-dataclasses/project/expense_tracker/models.py?raw'
import s2 from '../../../spine/model/02-dataclasses/session.txt?raw'
import m3 from '../../../spine/model/03-enum/project/expense_tracker/models.py?raw'
import s3 from '../../../spine/model/03-enum/session.txt?raw'
import m4 from '../../../spine/model/04-properties/project/expense_tracker/models.py?raw'
import s4 from '../../../spine/model/04-properties/session.txt?raw'
import y5 from '../../../spine/model/05-money/project/expense_tracker/money.py?raw'
import s5 from '../../../spine/model/05-money/session.txt?raw'
import r6 from '../../../spine/model/06-containers/project/expense_tracker/report.py?raw'
import s6 from '../../../spine/model/06-containers/session.txt?raw'
import e7 from '../../../spine/model/07-inheritance/project/expense_tracker/errors.py?raw'
import s7 from '../../../spine/model/07-inheritance/session.txt?raw'
import t8 from '../../../spine/model/08-protocols/project/expense_tracker/store.py?raw'
import s8 from '../../../spine/model/08-protocols/session.txt?raw'
import t9 from '../../../spine/model/09-context-managers/project/expense_tracker/store.py?raw'
import s9 from '../../../spine/model/09-context-managers/session.txt?raw'

// Course 8 — model it with classes, on IDE frame v2 (each side pane: the section's mental model as
// its title, one diagram, at most one table). Values are the sessions' output.
const MODS = ['__init__.py', '__main__.py', 'bank.py', 'categorise.py', 'cli.py', 'models.py', 'money.py', 'report.py', 'store.py']
const MODS7 = ['__init__.py', '__main__.py', 'bank.py', 'categorise.py', 'cli.py', 'errors.py', 'models.py', 'money.py', 'report.py', 'store.py']
const at = (f: string) => `expense_tracker/${f}`

// §1 — classes: the instance holds the data, the class holds the code.
const classes1 = ideFrame2({
  model: 'The instance holds data; the class holds code', tree: pkgTree(MODS, 'models.py', ['models.py']), editor: { file: at('models.py'), code: m1, highlight: linesFrom(m1, 'class Expense:', 'self.category = category') }, session: s1,
  side: [
    {
      type: 'group', id: 'inst', title: 'e = Expense(…)', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        names('n', ['e']),
        { type: 'group', id: 'objs', bare: true, children: [
          obj('instance', 'an Expense: its own attributes', [['date', "'2026-10-01'"], ['description', "'Café Lumen'"], ['amount', '4.5'], ['category', "'food'"]], 'store'),
          obj('cls', 'class Expense: the code', [['__init__'], ['… and what every class gets']]),
        ] },
      ],
    },
    {
      type: 'table', id: 'was', title: 'A tuple, then an Expense', tone: 'ingest', columns: ['the code said', 'now says'], rows: [['e[2]', 'e.amount'], ['e[3] == category', 'e.category == category']],
    },
  ],
  edges: [{ from: 'n.e', to: 'instance' }, { from: 'instance', to: 'cls', label: 'its class' }],
})

// §2 — dataclasses: what @dataclass writes for you.
const dc2 = ideFrame2({
  model: '@dataclass writes the methods from the fields', tree: pkgTree(MODS, 'models.py'), editor: { file: at('models.py'), code: m2, highlight: linesFrom(m2, '@dataclass', 'category: str') }, session: s2,
  side: [
    {
      type: 'group', id: 'gen', title: '@dataclass reads the annotations…', icon: 'code', tone: 'ingest', children: [
        { type: 'table', id: 'fields', title: 'fields', rows: [['date: str'], ['description: str'], ['amount: Decimal'], ['category: str']] },
        { type: 'table', id: 'methods', title: '…and writes the methods', tone: 'store', rows: [{ id: 'init', cells: ['__init__(self, date, …)'] }, { id: 'repr', cells: ['__repr__: Expense(date=…)'] }, { id: 'eq', cells: ['__eq__: field by field'] }] },
      ],
    },
    { type: 'table', id: 'opts', title: 'Options used later', tone: 'ingest', columns: ['@dataclass(…)', 'adds'], rows: [['frozen=True', 'no changes after creation'], ['order=True', '<, > by the fields']] },
  ],
  edges: [{ from: 'fields', to: 'methods', label: 'generates' }],
})

// §3 — Enum: the categories that exist.
const enum3 = ideFrame2({
  model: 'A fixed set of members, and nothing else', tree: pkgTree(MODS, 'models.py'), editor: { file: at('models.py'), code: m3, highlight: linesFrom(m3, 'FOOD = "food"', 'OTHER = "other"') }, session: s3,
  side: [
    {
      type: 'group', id: 'members', title: 'Category: seven members', icon: 'filter', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'texts', title: 'text', rows: [{ id: 't-food', cells: ['"food"'] }, { id: 't-fun', cells: ['"fun"'] }, { id: 't-fod', cells: ['"fod"'] }] },
        { type: 'table', id: 'cats', title: 'Category(text)', rows: [{ id: 'c-food', cells: ['Category.FOOD'], tone: 'store' }, { id: 'c-fun', cells: ['Category.FUN'], tone: 'store' }, { id: 'c-none', cells: ['ValueError: not one'], tone: 'consume' }] },
      ],
    },
    {
      type: 'table', id: 'used', title: 'Where Category is used now', tone: 'store', columns: ['module', 'how'], rows: [
        ['categorise', 'RULES → members'], ['report', 'BUDGETS keys'], ['cli', 'type=Category'], ['store', 'Category(…) on load'],
      ],
    },
  ],
  edges: [{ from: 'texts.t-food', to: 'cats.c-food' }, { from: 'texts.t-fun', to: 'cats.c-fun' }, { from: 'texts.t-fod', to: 'cats.c-none' }],
})

// §4 — properties and invariants.
const prop4 = ideFrame2({
  model: 'Checked once, where it is made', tree: pkgTree(MODS, 'models.py'), editor: { file: at('models.py'), code: m4, highlight: linesFrom(m4, 'def __post_init__', 'return self.date[:7]') }, session: s4,
  side: [
    {
      type: 'group', id: 'make', title: 'Expense(…) is made', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'init', title: '__init__ (generated)', sub: 'stores the four fields', icon: 'code' },
        { type: 'group', id: 'check', bare: true, dir: 'row', children: [
          { type: 'item', id: 'post', title: '__post_init__', sub: 'amount more than zero?', icon: 'search' },
          { type: 'item', id: 'bad', title: 'InvalidAmount', sub: 'no expense is made', icon: 'bell', tone: 'consume' },
        ] },
        { type: 'item', id: 'ok', title: 'an Expense', sub: 'always valid', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'prop', title: '@property: read like an attribute', tone: 'store', columns: ['written', 'runs'], rows: [['e.month', 'self.date[:7]'], ['for 2026-10-16', "'2026-10'"]],
    },
  ],
  edges: [{ from: 'init', to: 'post' }, { from: 'post', to: 'ok', label: 'yes' }, { from: 'post', to: 'bad', label: 'no' }],
})

// §5 — a value object: Money.
const money5 = ideFrame2({
  model: 'A value object: a + b makes a new one', tree: pkgTree(MODS, 'money.py'), editor: { file: at('money.py'), code: y5, highlight: [lineOf(y5, '@dataclass(frozen=True'), ...linesFrom(y5, 'def __add__', 'return Money(self.amount')],
    show: [[lineOf(y5, '@dataclass(frozen=True'), lineOf(y5, '@dataclass(frozen=True')], [lineOf(y5, 'def __add__'), lineOf(y5, 'return Money(self.amount')]] }, session: s5,
  side: [
    {
      type: 'group', id: 'add', title: 'a + b makes a NEW Money', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        { type: 'group', id: 'ops', bare: true, children: [obj('a', 'Money', [['4.50', 'GBP']]), obj('b', 'Money', [['12.99', 'GBP']])] },
        obj('sum', 'Money: the result', [['17.49', 'GBP']], 'store'),
      ],
    },
    {
      type: 'table', id: 'dunders', title: 'What Money defines', tone: 'ingest', columns: ['method', 'makes work'], rows: [
        ['__add__', 'a + b, one currency only'], ['__radd__', 'sum(…), which starts at 0'], ['__format__', 'f"{spent:>9.2f}"'], ['frozen=True', 'hashable; never changes'],
      ],
    },
  ],
  edges: [{ from: 'a', to: 'sum' }, { from: 'b', to: 'sum' }],
})

// §6 — a container: Budget, through its dunders.
const DUNDERS = ['__len__', '__iter__', '__contains__', '__getitem__']
const budget6 = ideFrame2({
  model: 'Syntax calls a dunder method', tree: pkgTree(MODS, 'report.py'), editor: { file: at('report.py'), code: r6, highlight: DUNDERS.map((d) => lineOf(r6, `def ${d}(`)),
    // the four methods the diagram maps, one row each
    show: DUNDERS.map((d): [number, number] => [lineOf(r6, `def ${d}(`), lineOf(r6, `def ${d}(`)]) }, session: s6,
  side: [
    {
      type: 'group', id: 'map', title: 'Python syntax → Budget method', icon: 'code', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'syntax', title: 'you write', rows: [{ id: 'len', cells: ['len(BUDGET)'] }, { id: 'for', cells: ['for c in BUDGET'] }, { id: 'in', cells: ['c in BUDGET'] }, { id: 'get', cells: ['BUDGET[c]'] }] },
        { type: 'table', id: 'dunder', title: 'Python calls', tone: 'store', rows: [{ id: 'd-len', cells: ['__len__'] }, { id: 'd-iter', cells: ['__iter__'] }, { id: 'd-in', cells: ['__contains__'] }, { id: 'd-get', cells: ['__getitem__'] }] },
      ],
    },
    { type: 'table', id: 'uses', title: 'report() did not change', tone: 'store', columns: ['code', 'calls'], rows: [['sorted(BUDGET, key=…)', '__iter__'], ['BUDGET[category]', '__getitem__']] },
  ],
  edges: [{ from: 'syntax.len', to: 'dunder.d-len' }, { from: 'syntax.for', to: 'dunder.d-iter' }, { from: 'syntax.in', to: 'dunder.d-in' }, { from: 'syntax.get', to: 'dunder.d-get' }],
})

// §7 — inheritance: one family of errors.
const inherit7 = ideFrame2({
  model: 'One family: catch the parent, catch them all', tree: pkgTree(MODS7, 'errors.py', ['errors.py']), editor: { file: at('errors.py'), code: e7, highlight: linesFrom(e7, 'class UnknownCategory', 'self.text = text') }, session: s7,
  side: [
    {
      type: 'group', id: 'tree', title: 'The family', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'base', title: 'TrackerError(Exception)', sub: 'cli catches this one', icon: 'shield', tone: 'store' },
        { type: 'group', id: 'kids', title: 'its children', dir: 'grid', cols: 2, children: [
          { type: 'item', id: 'amount', title: 'InvalidAmount', sub: 'also a ValueError', icon: 'card' },
          { type: 'item', id: 'row', title: 'InvalidRow', icon: 'table' },
          { type: 'item', id: 'cat', title: 'UnknownCategory', sub: 'super().__init__(…)', icon: 'filter' },
        ] },
      ],
    },
    {
      type: 'table', id: 'runs', title: 'add, three times', tone: 'ingest', columns: ['typed', 'answer'], rows: [
        { id: 'fod', cells: ['add 3.20 fod bakery', 'unknown category'], tone: 'consume' }, { id: 'comma', cells: ['add 12,50 food', 'not a number'], tone: 'consume' }, { id: 'ok', cells: ['add 3.20 FOOD bakery', 'added'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'kids', to: 'base', label: 'each is a' }],
})

// §8 — protocols and polymorphism: two stores, one interface.
const proto8 = ideFrame2({
  model: 'Two stores, one shape', tree: pkgTree(MODS, 'store.py'), editor: { file: at('store.py'), code: t8, highlight: linesFrom(t8, 'class Store(Protocol):', 'def save(self, expenses): ...') }, session: s8,
  side: [
    {
      type: 'group', id: 'shape', title: 'Store: load() and save(expenses)', icon: 'database', tone: 'ingest', children: [
        { type: 'item', id: 'cli', title: 'cli.main', sub: 'STORES[args.store]()', icon: 'terminal' },
        { type: 'group', id: 'impls', bare: true, dir: 'row', children: [
          { type: 'item', id: 'json', title: 'JsonStore', sub: 'data/expenses.json', icon: 'file' },
          { type: 'item', id: 'sqlite', title: 'SqliteStore', sub: 'data/expenses.db', icon: 'database', tone: 'store' },
        ] },
      ],
    },
    {
      type: 'table', id: 'duck', title: 'Neither inherits from Store', tone: 'store', columns: ['', 'JsonStore', 'SqliteStore'], rows: [['load()', 'reads JSON', 'SELECT'], ['save()', 'writes JSON', 'DELETE + INSERT']],
    },
  ],
  edges: [{ from: 'cli', to: 'json', dashed: true }, { from: 'cli', to: 'sqlite' }],
})

// §9 — context managers: commit, or roll back.
// SqliteStore's own __enter__ and __exit__ (Store and JsonStore define them first).
const SQ_ENTER = lineOf(t9, 'def __enter__', lineOf(t9, 'class SqliteStore'))
const SQ_EXIT = lineOf(t9, 'def __exit__', lineOf(t9, 'class SqliteStore'))
const ctx9 = ideFrame2({
  model: 'with: commit, or roll back', tree: pkgTree(MODS, 'store.py'), editor: { file: at('store.py'), code: t9, highlight: [SQ_ENTER, ...Array.from({ length: lineOf(t9, 'self.db.rollback()') - SQ_EXIT + 1 }, (_, i) => SQ_EXIT + i)],
    show: [[SQ_ENTER, SQ_ENTER], [SQ_EXIT, lineOf(t9, 'self.db.rollback()')]] }, session: s9,
  side: [
    {
      type: 'group', id: 'paths', title: 'with SqliteStore() as s:', icon: 'lock', tone: 'ingest', children: [
        { type: 'item', id: 'enter', title: '__enter__', sub: 'connect, make sure the table exists', icon: 'database' },
        { type: 'item', id: 'body', title: 'the with block', sub: 's.save([]); 1 / 0', icon: 'code' },
        { type: 'group', id: 'exits', bare: true, dir: 'row', children: [
          { type: 'item', id: 'commit', title: 'no error: commit', icon: 'check', tone: 'store' },
          { type: 'item', id: 'rollback', title: 'an error: rollback', sub: 'the DELETE is undone', icon: 'bell', tone: 'consume' },
        ] },
      ],
    },
    { type: 'table', id: 'exit', title: '__exit__(self, kind, error, tb)', tone: 'ingest', columns: ['the block', 'error is', 'so'], rows: [['finished', 'None', 'commit'], ['raised', 'the exception', 'roll back']] },
  ],
  edges: [{ from: 'enter', to: 'body' }, { from: 'body', to: 'commit' }, { from: 'body', to: 'rollback' }],
})

export const modelScenes: Record<string, SceneModel> = {
  'model-classes': classes1, 'model-dataclasses': dc2, 'model-enum': enum3, 'model-properties': prop4, 'model-money': money5,
  'model-containers': budget6, 'model-inheritance': inherit7, 'model-protocols': proto8, 'model-context-managers': ctx9,
}
