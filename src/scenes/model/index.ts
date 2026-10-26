import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
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

// Course 8 — model it with classes. Values are the sessions' output.
const MODS = ['__init__.py', '__main__.py', 'bank.py', 'categorise.py', 'cli.py', 'models.py', 'money.py', 'report.py', 'store.py']
const MODS7 = ['__init__.py', '__main__.py', 'bank.py', 'categorise.py', 'cli.py', 'errors.py', 'models.py', 'money.py', 'report.py', 'store.py']
const at = (f: string) => `expense_tracker/${f}`

// §1 — classes: the instance holds the data, the class holds the code.
const classes1 = ideFrame({
  tree: pkgTree(MODS, 'models.py', ['models.py']), editor: { file: at('models.py'), code: m1, highlight: linesFrom(m1, 'class Expense:', 'self.category = category') }, session: s1,
  side: [
    {
      type: 'group', id: 'inst', title: 'e = Expense("2026-10-01", "Café Lumen", 4.50, "food")', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        names('n', ['e']),
        { type: 'group', id: 'objs', bare: true, children: [
          obj('instance', 'an Expense: its own attributes', [['date', "'2026-10-01'"], ['description', "'Café Lumen'"], ['amount', '4.5'], ['category', "'food'"]], 'store'),
          obj('cls', 'class Expense: the code', [['__init__'], ['… and what every class gets']]),
        ] },
      ],
    },
    {
      type: 'table', id: 'repl', title: 'The REPL', tone: 'consume', columns: ['asked', 'answer'], rows: [
        ['e', '<…Expense object at 0x…>'], { id: 'eq', cells: ['e == Expense(… same …)', 'False'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'was', title: 'A tuple, then an Expense', tone: 'ingest', columns: ['the code said', 'now says'], rows: [['e[2]', 'e.amount'], ['e[3] == category', 'e.category == category']],
    },
    { type: 'item', id: 'cap', title: 'self', icon: 'user', tone: 'ingest', bullets: ['the object the method was called on', 'self.amount: this expense\'s amount'] },
    { type: 'note', id: 'c-note', tone: 'consume', text: 'Two problems the next section fixes: printing an Expense shows an address, and two equal expenses are not ==.' },
  ],
  edges: [{ from: 'n.e', to: 'instance' }, { from: 'instance', to: 'cls', label: 'its class' }],
})

// §2 — dataclasses: what @dataclass writes for you.
const dc2 = ideFrame({
  tree: pkgTree(MODS, 'models.py'), editor: { file: at('models.py'), code: m2, highlight: linesFrom(m2, '@dataclass', 'category: str') }, session: s2,
  side: [
    {
      type: 'group', id: 'gen', title: '@dataclass reads the annotations…', icon: 'code', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'fields', title: 'fields', rows: [['date: str'], ['description: str'], ['amount: Decimal'], ['category: str']] },
        { type: 'table', id: 'methods', title: '…and writes the methods', tone: 'store', rows: [{ id: 'init', cells: ['__init__(self, date, …)'] }, { id: 'repr', cells: ['__repr__: Expense(date=…)'] }, { id: 'eq', cells: ['__eq__: field by field'] }] },
      ],
    },
    {
      type: 'table', id: 'repl', title: 'The REPL, again', tone: 'store', columns: ['asked', 'answer'], rows: [
        ['e', "Expense(date='2026-10-01', …, amount=4.5, …)"], { id: 'eq2', cells: ['e == Expense(… same …)', 'True'], tone: 'store' },
      ],
    },
    { type: 'item', id: 'cap', title: 'Annotations', icon: 'code', tone: 'ingest', bullets: ['name: type declares a field', 'Python does not check them (Course 9 does)'] },
    { type: 'table', id: 'top', title: 'top: unchanged', tone: 'store', rows: [['2026-10-04 Train to Porto 68.40 transport'], ['2026-10-05 Concert tickets 64.00 fun']] },
    { type: 'table', id: 'opts', title: 'Options used later', tone: 'ingest', columns: ['@dataclass(…)', 'adds'], rows: [['frozen=True', 'no changes after creation'], ['order=True', '<, > by the fields']] },
    { type: 'note', id: 'd-note', tone: 'ingest', text: 'Six lines replace a hand-written class, and the app ran top unchanged: nothing outside models.py noticed.' },
  ],
  edges: [{ from: 'fields', to: 'methods', label: 'generates' }],
})

// §3 — Enum: the categories that exist.
const enum3 = ideFrame({
  tree: pkgTree(MODS, 'models.py'), editor: { file: at('models.py'), code: m3, ...view(m3, 'class Category(StrEnum):', undefined, 0), highlight: linesFrom(m3, 'class Category(StrEnum):', 'OTHER = "other"') }, session: s3,
  side: [
    {
      type: 'group', id: 'members', title: 'Category: seven members, no more', icon: 'filter', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'texts', title: 'text', rows: [{ id: 't-food', cells: ['"food"'] }, { id: 't-fun', cells: ['"fun"'] }, { id: 't-fod', cells: ['"fod"'] }] },
        { type: 'table', id: 'cats', title: 'Category(text)', rows: [{ id: 'c-food', cells: ['Category.FOOD'], tone: 'store' }, { id: 'c-fun', cells: ['Category.FUN'], tone: 'store' }, { id: 'c-none', cells: ['ValueError: not one'], tone: 'consume' }] },
      ],
    },
    {
      type: 'table', id: 'repl', title: 'The REPL', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        ['Category("food"), Category.FOOD == "food"', '(<Category.FOOD: …>, True)'], ['"fod" in Category', 'False'],
      ],
    },
    { type: 'table', id: 'cli', title: 'add 3.20 fod bakery', tone: 'consume', rows: [["error: argument category: invalid Category value: 'fod'"]] },
    {
      type: 'table', id: 'used', title: 'Where Category is used now', tone: 'store', columns: ['module', 'how'], rows: [
        ['categorise', 'RULES map patterns to members'], ['report', 'BUDGETS keyed by members'], ['cli', 'add: type=Category, choices'], ['store', 'Category(r["category"]) on load'],
      ],
    },
    { type: 'item', id: 'cap', title: 'is, not ==', icon: 'search', tone: 'ingest', bullets: ['each member is one object', 'category is Category.OTHER'] },
    { type: 'note', id: 'e-note', tone: 'store', text: 'A StrEnum member IS a str, so JSON, f-strings and == "food" keep working. A typo is now an error, not a new category.' },
  ],
  edges: [{ from: 'texts.t-food', to: 'cats.c-food' }, { from: 'texts.t-fun', to: 'cats.c-fun' }, { from: 'texts.t-fod', to: 'cats.c-none' }],
})

// §4 — properties and invariants.
const prop4 = ideFrame({
  tree: pkgTree(MODS, 'models.py'), editor: { file: at('models.py'), code: m4, ...view(m4, 'class Expense:', undefined, 0), highlight: linesFrom(m4, 'def __post_init__', 'return self.date[:7]') }, session: s4,
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
      type: 'table', id: 'prop', title: '@property: a method read like an attribute', tone: 'store', columns: ['written', 'runs'], rows: [['e.month', 'self.date[:7]'], ['for 2026-10-16', "'2026-10'"]],
    },
    { type: 'table', id: 'repl', title: 'The REPL', tone: 'consume', columns: ['typed', 'answer'], rows: [['Expense(…, Decimal("-3"), …)', 'InvalidAmount'], ['its message', 'must be more than zero: -3']] },
    { type: 'item', id: 'cap', title: 'An invariant', icon: 'shield', tone: 'store', bullets: ['true of every object, always', 'checked once, where it is made'] },
    { type: 'note', id: 'p-note', tone: 'ingest', text: 'report now asks expense.month == month. No caller anywhere can build an expense of −3.' },
  ],
  edges: [{ from: 'init', to: 'post' }, { from: 'post', to: 'ok', label: 'yes' }, { from: 'post', to: 'bad', label: 'no' }],
})

// §5 — a value object: Money.
const money5 = ideFrame({
  tree: pkgTree(MODS, 'money.py'), editor: { file: at('money.py'), code: y5, ...view(y5, '@dataclass(frozen=True', undefined, 0), highlight: linesFrom(y5, '@dataclass(frozen=True', 'return Money(self.amount') }, session: s5,
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
    { type: 'table', id: 'eur', title: '4.50 GBP + 48.00 EUR', tone: 'consume', rows: [['ValueError: cannot add EUR to GBP']] },
    { type: 'table', id: 'repl', title: 'The REPL', tone: 'store', columns: ['typed', 'answer'], rows: [['4.50 + 12.99', "Money(amount=Decimal('17.49'), currency='GBP')"]] },
    { type: 'item', id: 'cap', title: 'A value object', icon: 'card', tone: 'ingest', bullets: ['equal when the values are equal', 'never changes: safe to share and hash'] },
    { type: 'note', id: 'v-note', tone: 'store', text: 'A value object is equal to any other with the same value, and can never change. Expense.amount is now a Money.' },
  ],
  edges: [{ from: 'a', to: 'sum' }, { from: 'b', to: 'sum' }],
})

// §6 — a container: Budget, through its dunders.
const budget6 = ideFrame({
  tree: pkgTree(MODS, 'report.py'), editor: { file: at('report.py'), code: r6, ...view(r6, 'class Budget:', undefined, 0), highlight: linesFrom(r6, 'class Budget:', 'return self._limits[category]') }, session: s6,
  side: [
    {
      type: 'group', id: 'map', title: 'Python syntax → Budget method', icon: 'code', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'syntax', title: 'you write', rows: [{ id: 'len', cells: ['len(BUDGET)'] }, { id: 'for', cells: ['for c in BUDGET'] }, { id: 'in', cells: ['c in BUDGET'] }, { id: 'get', cells: ['BUDGET[c]'] }] },
        { type: 'table', id: 'dunder', title: 'Python calls', tone: 'store', rows: [{ id: 'd-len', cells: ['__len__'] }, { id: 'd-iter', cells: ['__iter__'] }, { id: 'd-in', cells: ['__contains__'] }, { id: 'd-get', cells: ['__getitem__'] }] },
      ],
    },
    {
      type: 'table', id: 'repl', title: 'The REPL', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        ['len, FUN in, OTHER in', '(6, True, False)'], ['BUDGET[Category.FUN]', "Decimal('60')"], ['[str(c) for c in BUDGET]', "['food', 'transport', …]"],
      ],
    },
    { type: 'table', id: 'uses', title: 'report() did not change', tone: 'store', columns: ['code', 'calls'], rows: [['sorted(BUDGET, key=…)', '__iter__'], ['BUDGET[category]', '__getitem__']] },
    { type: 'item', id: 'cap', title: 'Why a class', icon: 'boxes', tone: 'ingest', bullets: ['the limits stay private: _limits', 'budget rules get a home later'] },
    { type: 'item', id: 'cap2', title: 'The protocol', icon: 'code', tone: 'store', bullets: ['define the dunders', 'get the syntax'] },
    { type: 'note', id: 'b-note', tone: 'ingest', text: 'Implement the protocol and the class behaves like a built-in container: the report code reads exactly as it did with a dict.' },
  ],
  edges: [{ from: 'syntax.len', to: 'dunder.d-len' }, { from: 'syntax.for', to: 'dunder.d-iter' }, { from: 'syntax.in', to: 'dunder.d-in' }, { from: 'syntax.get', to: 'dunder.d-get' }],
})

// §7 — inheritance: one family of errors.
const inherit7 = ideFrame({
  tree: pkgTree(MODS7, 'errors.py', ['errors.py']), editor: { file: at('errors.py'), code: e7, highlight: linesFrom(e7, 'class UnknownCategory', 'self.text = text') }, session: s7,
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
        { id: 'fod', cells: ['add 3.20 fod bakery', "unknown category: 'fod'"], tone: 'consume' }, { id: 'comma', cells: ['add 12,50 food', "not a number: '12,50'"], tone: 'consume' }, { id: 'ok', cells: ['add 3.20 FOOD bakery', 'added 3.20 GBP to food'], tone: 'store' },
      ],
    },
    { type: 'table', id: 'mro', title: 'InvalidAmount.__mro__: the lookup order', tone: 'store', rows: [['InvalidAmount → TrackerError → ValueError'], ['→ Exception → BaseException → object']] },
    { type: 'item', id: 'cap', title: 'One except for the family', icon: 'shield', tone: 'ingest', bullets: ['except TrackerError catches all three', 'super() runs the parent\'s method'] },
  ],
  edges: [{ from: 'kids', to: 'base', label: 'each is a' }],
})

// §8 — protocols and polymorphism: two stores, one interface.
const proto8 = ideFrame({
  tree: pkgTree(MODS, 'store.py'), editor: { file: at('store.py'), code: t8, ...view(t8, 'class Store(Protocol):', undefined, 0), highlight: linesFrom(t8, 'class Store(Protocol):', 'def save(self, expenses): ...') }, session: s8,
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
    { type: 'table', id: 'top', title: '--store sqlite top', tone: 'ingest', rows: [['2026-09-20 TESCO STORES 2041 41.10 GBP food'], ['2026-09-15 THAMES WATER 32.40 GBP bills']] },
    { type: 'table', id: 'imp', title: '--store sqlite import', tone: 'ingest', rows: [['the same 5 rows rejected'], ['12 imported, into data/expenses.db']] },
    { type: 'item', id: 'cap', title: 'Duck typing', icon: 'database', tone: 'store', bullets: ['if it loads and saves like a store', 'it is a store'] },
    { type: 'note', id: 'p-note', tone: 'ingest', text: 'A Protocol describes a shape: any object with these methods fits. cli calls load and save without knowing which store it holds.' },
  ],
  edges: [{ from: 'cli', to: 'json', dashed: true }, { from: 'cli', to: 'sqlite' }],
})

// §9 — context managers: commit, or roll back.
const ctx9 = ideFrame({
  tree: pkgTree(MODS, 'store.py'), editor: { file: at('store.py'), code: t9, ...view(t9, 'class SqliteStore:', 'return False    # an error', 0), highlight: linesFrom(t9, 'self.db = sqlite3.connect', 'return False    # an error') }, session: s9,
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
    {
      type: 'table', id: 'repl', title: 'The REPL', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        ['len(s.load()), before', '12'], { id: 'fail', cells: ['save([]), then 1 / 0', 'rolled back'], tone: 'consume' }, { id: 'after', cells: ['len(s.load()), after', '12: nothing lost'], tone: 'store' },
      ],
    },
    { type: 'table', id: 'exit', title: '__exit__(self, kind, error, traceback)', tone: 'ingest', columns: ['when', 'error is'], rows: [['the block finished', 'None: commit'], ['the block raised', 'the exception: roll back']] },
    { type: 'item', id: 'cap', title: 'Also context managers', icon: 'lock', tone: 'ingest', bullets: ['open(): closes the file', 'suppress(Error): swallows one kind'] },
    { type: 'note', id: 'c-note', tone: 'store', text: 'Any class with __enter__ and __exit__ works with with. __exit__ returns False, so the error still reaches suppress, outside.' },
  ],
  edges: [{ from: 'enter', to: 'body' }, { from: 'body', to: 'commit' }, { from: 'body', to: 'rollback' }],
})

export const modelScenes: Record<string, SceneModel> = {
  'model-classes': classes1, 'model-dataclasses': dc2, 'model-enum': enum3, 'model-properties': prop4, 'model-money': money5,
  'model-containers': budget6, 'model-inheritance': inherit7, 'model-protocols': proto8, 'model-context-managers': ctx9,
}
