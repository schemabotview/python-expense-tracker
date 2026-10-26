import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, linesFrom } from '../ide'
import { names, obj } from '../mem'
import { project } from '../start/tree'
import c1 from '../../../spine/hold/01-names/project/main.py?raw'
import s1 from '../../../spine/hold/01-names/session.txt?raw'
import c2 from '../../../spine/hold/02-decimal/project/main.py?raw'
import s2 from '../../../spine/hold/02-decimal/session.txt?raw'
import c3 from '../../../spine/hold/03-strings/project/main.py?raw'
import s3 from '../../../spine/hold/03-strings/session.txt?raw'
import c4 from '../../../spine/hold/04-none-and-sentinels/project/main.py?raw'
import s4 from '../../../spine/hold/04-none-and-sentinels/session.txt?raw'
import c5 from '../../../spine/hold/05-lists/project/main.py?raw'
import s5 from '../../../spine/hold/05-lists/session.txt?raw'
import c6 from '../../../spine/hold/06-tuples/project/main.py?raw'
import s6 from '../../../spine/hold/06-tuples/session.txt?raw'
import c7 from '../../../spine/hold/07-dicts/project/main.py?raw'
import s7 from '../../../spine/hold/07-dicts/session.txt?raw'
import c8 from '../../../spine/hold/08-sets-and-frozendict/project/main.py?raw'
import s8 from '../../../spine/hold/08-sets-and-frozendict/session.txt?raw'
import c9 from '../../../spine/hold/09-aliasing-and-copying/project/main.py?raw'
import s9 from '../../../spine/hold/09-aliasing-and-copying/session.txt?raw'

// Course 3 — hold the data. Every value in a side pane is in the step's session or main.py.
const tree = project('active')

// §1 — names and objects ◆ the heap: a rebind moves one arrow.
const names1 = ideFrame({
  tree, editor: { file: 'main.py', code: c1, highlight: linesFrom(c1, 'date =', 'category =') }, session: s1,
  side: [
    {
      type: 'group', id: 'before', title: 'After paid = amount', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        names('b-names', ['amount', 'paid']),
        obj('b-45', 'float', [['4.5']]),
      ],
    },
    {
      type: 'group', id: 'after', title: 'After amount = 5.20', icon: 'memory', tone: 'store', dir: 'row', children: [
        names('a-names', ['amount', 'paid']),
        { type: 'group', id: 'a-objs', bare: true, children: [obj('a-52', 'float: a new object', [['5.2']], 'store'), obj('a-45', 'float', [['4.5']])] },
      ],
    },
    {
      type: 'table', id: 'main-names', title: "main.py's names", tone: 'ingest', columns: ['name', 'refers to', 'a'], rows: [
        ['date', "'2026-10-01'", 'str'], ['description', "'Café Lumen'", 'str'], ['amount', '4.5', 'float'], ['category', "'food'", 'str'],
      ],
    },
    {
      type: 'table', id: 'answers', title: 'Python answers', tone: 'store', columns: ['typed', 'answer'], rows: [
        ['paid', '4.5'], { id: 'is', cells: ['paid is amount', 'False'], tone: 'store' },
      ],
    },
    { type: 'item', id: 'cap', title: 'What to remember', icon: 'memory', tone: 'ingest', bullets: ['a name refers to an object', 'reassigning moves only that name'] },
    { type: 'note', id: 'n-note', tone: 'ingest', text: 'Assignment binds a name to an object on the heap. amount = 5.20 moves only amount; paid still refers to 4.5, so paid is amount is False.' },
  ],
  edges: [
    { from: 'b-names.amount', to: 'b-45' }, { from: 'b-names.paid', to: 'b-45' },
    { from: 'a-names.amount', to: 'a-52' }, { from: 'a-names.paid', to: 'a-45' },
  ],
})

// §2 — numbers, and why money is a Decimal.
const decimal2 = ideFrame({
  tree, editor: { file: 'main.py', code: c2, highlight: [lineOf(c2, 'from decimal'), lineOf(c2, 'amount ='), lineOf(c2, 'lunch =')] }, session: s2,
  side: [
    {
      type: 'table', id: 'stored', title: 'What is really stored', tone: 'consume', columns: ['typed', 'stored as'], rows: [
        { id: 'f01', cells: ['0.1 (float)', '0.1000000000000000055511151231257827…'], tone: 'consume' },
        { id: 'd01', cells: ['Decimal("0.1")', '0.1, exactly'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'sums', title: 'The same sums', tone: 'ingest', columns: ['', 'float', 'Decimal'], rows: [
        ['0.1 + 0.2', '0.30000000000000004', '0.3'],
        ['4.50 + 12.99', '17.490000000000002', '17.49'],
        ['4.50 prints as', '4.5', '4.50'],
      ],
    },
    {
      type: 'table', id: 'kinds', title: 'Three kinds of number', tone: 'ingest', columns: ['type', 'for', 'example'], rows: [
        ['int', 'counting', '3 expenses'],
        ['float', 'measuring, approximately', 'a distance'],
        { id: 'dec', cells: ['Decimal', 'money, exactly', '4.50'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'printed', title: 'main.py now prints', tone: 'store', columns: ['line', 'printed'], rows: [
        ['amount', '4.50'], { id: 'total', cells: ['amount + lunch', '17.49'], tone: 'store' },
      ],
    },
    { type: 'item', id: 'cap', title: 'The rule for money', icon: 'card', tone: 'store', bullets: ['every amount a Decimal', 'built from a string'] },
    { type: 'note', id: 'd-note', tone: 'store', text: 'Make a Decimal from a STRING. Decimal(0.1) copies the float, error and all.' },
  ],
})

// §3 — strings: a date is indexed characters; a slice is a new string.
const DATE = '2026-10-01'.split('')
const strings3 = ideFrame({
  tree, editor: { file: 'main.py', code: c3, highlight: linesFrom(c3, 'month =', 'print(f"month') }, session: s3,
  side: [
    {
      type: 'table', id: 'cells', title: 'date = "2026-10-01"', tone: 'ingest', columns: ['index', ...DATE.map((_, i) => String(i))],
      rows: [{ id: 'chars', cells: ['char', ...DATE] }, { id: 'neg', cells: ['from the end', ...DATE.map((_, i) => String(i - 10))] }],
    },
    {
      type: 'group', id: 'slices', title: 'Slices: [start:stop], stop not included', icon: 'filter', tone: 'store', dir: 'row', children: [
        {
          type: 'table', id: 'exprs', columns: ['slice'], rows: [{ id: 'mo', cells: ['date[:7]'] }, { id: 'mm', cells: ['date[5:7]'] }, { id: 'dd', cells: ['date[-2:]'] }],
        },
        {
          type: 'table', id: 'results', columns: ['a new string'], rows: [{ id: 'r-mo', cells: ["'2026-10'"] }, { id: 'r-mm', cells: ["'10'"] }, { id: 'r-dd', cells: ["'01'"] }],
        },
      ],
    },
    {
      type: 'table', id: 'fmt', title: 'An f-string fills in the names', tone: 'ingest', columns: ['in the code', 'printed'], rows: [
        ['{date}', '2026-10-01'], ['{description.upper()}', 'CAFÉ LUMEN'], ['{month}', '2026-10'],
      ],
    },
    {
      type: 'table', id: 'printed', title: 'main.py prints', tone: 'store', rows: [
        ['2026-10-01  Café Lumen  4.50  food'], ['month 2026-10, shop CAFÉ LUMEN'],
      ],
    },
    { type: 'item', id: 'cap', title: 'Indexes', icon: 'search', tone: 'ingest', bullets: ['start at 0 from the left', 'start at -1 from the right'] },
    { type: 'note', id: 's-note', tone: 'ingest', text: 'A string never changes: slicing and upper() build new strings and leave date and description as they were.' },
  ],
  edges: [
    { from: 'exprs.mo', to: 'results.r-mo' }, { from: 'exprs.mm', to: 'results.r-mm' }, { from: 'exprs.dd', to: 'results.r-dd' },
  ],
})

// §4 — None and sentinels: "no value" and "not given" are different states.
const none4 = ideFrame({
  tree, editor: { file: 'main.py', code: c4, highlight: [lineOf(c4, 'NOT_ASKED = '), lineOf(c4, 'note = None'), lineOf(c4, 'receipt ='), lineOf(c4, 'print("note:')] }, session: s4,
  side: [
    {
      type: 'group', id: 'states', title: 'Three states of a field', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'st-value', title: 'a value', sub: 'note = "client lunch"', icon: 'file', tone: 'store' },
        { type: 'item', id: 'st-none', title: 'None: asked, nothing there', sub: 'note = None', icon: 'box' },
        { type: 'item', id: 'st-sentinel', title: 'NOT_ASKED: never asked', sub: 'receipt = NOT_ASKED (3.15 sentinel)', icon: 'key', tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'tests', title: 'Test with is, never ==', tone: 'ingest', columns: ['in main.py', 'here'], rows: [
        ['note is not None', 'False'], ['receipt is not NOT_ASKED', 'False'],
      ],
    },
    {
      type: 'table', id: 'truthy', title: 'Falsy values (the REPL)', tone: 'consume', columns: ['typed', 'answer'], rows: [
        ['bool(None)', 'False'], ['bool(0.0), bool(""), bool([])', '(False, False, False)'],
      ],
    },
    { type: 'note', id: 'n-note', tone: 'consume', text: 'Empty things and zero are falsy too. That is why a missing note is tested with is None: a 0.00 amount is not missing.' },
  ],
  edges: [
    { from: 'st-value', to: 'st-none', label: 'or' },
    { from: 'st-none', to: 'st-sentinel', label: 'or' },
  ],
})

// §5 — lists: slots that refer to objects, in order.
const lists5 = ideFrame({
  tree, editor: { file: 'main.py', code: c5, highlight: linesFrom(c5, 'today = [', 'print(len(today)') }, session: s5,
  side: [
    {
      type: 'group', id: 'heap', title: 'today: one list, three slots', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        names('l-names', ['today', 'amount']),
        { type: 'table', id: 'slots', title: 'list', columns: ['index', ''], rows: [{ id: 's0', cells: ['0', '●'] }, { id: 's1', cells: ['1', '●'] }, { id: 's2', cells: ['2', '●'], tone: 'store' }] },
        { type: 'group', id: 'vals', bare: true, children: [obj('v0', 'Decimal', [['4.50']]), obj('v1', 'Decimal', [['12.99']]), obj('v2', 'Decimal: appended', [['2.80']], 'store')] },
      ],
    },
    {
      type: 'table', id: 'ops', title: 'Asked of a list', tone: 'ingest', columns: ['typed', 'answer'], rows: [
        ["today[0], today[-1]", "('coffee', 'metro')"], ['today[1:]', "['lunch', 'metro']"], ['len(today)  (main.py)', '3'], ['sum(today)  (main.py)', '20.29'],
      ],
    },
    {
      type: 'group', id: 'slice', title: "today[1:] in the REPL: a new list", icon: 'filter', tone: 'store', dir: 'row', children: [
        { type: 'table', id: 'words', title: 'today', rows: [['coffee'], { id: 'w1', cells: ['lunch'] }, { id: 'w2', cells: ['metro'] }] },
        { type: 'table', id: 'newlist', title: 'a new list', rows: [{ id: 'n1', cells: ['lunch'] }, { id: 'n2', cells: ['metro'] }] },
      ],
    },
    { type: 'note', id: 'l-note', tone: 'ingest', text: 'A list keeps order and can change: append adds a slot at the end. Slot 0 and the name amount refer to the same 4.50.' },
  ],
  edges: [
    { from: 'l-names.today', to: 'slots' },
    { from: 'slots.s0', to: 'v0' }, { from: 'slots.s1', to: 'v1' }, { from: 'slots.s2', to: 'v2' },
    { from: 'words.w1', to: 'newlist.n1' }, { from: 'words.w2', to: 'newlist.n2' },
  ],
})

// §6 — tuples and unpacking: one record, four names.
const tuples6 = ideFrame({
  tree, editor: { file: 'main.py', code: c6, highlight: [lineOf(c6, 'date, description')] }, session: s6,
  side: [
    {
      type: 'group', id: 'unpack', title: 'date, description, amount, category = today[0]', icon: 'boxes', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'tup', title: 'tuple: today[0]', columns: ['index', 'value'], rows: [
          { id: 't0', cells: ['0', "'2026-10-01'"] }, { id: 't1', cells: ['1', "'Café Lumen'"] }, { id: 't2', cells: ['2', '4.50'] }, { id: 't3', cells: ['3', "'food'"] },
        ] },
        { type: 'table', id: 'tn', title: 'names', rows: [
          { id: 'n0', cells: ['date'] }, { id: 'n1', cells: ['description'] }, { id: 'n2', cells: ['amount'] }, { id: 'n3', cells: ['category'] },
        ] },
      ],
    },
    {
      type: 'table', id: 'lt', title: 'list or tuple?', tone: 'ingest', columns: ['', 'list', 'tuple'], rows: [
        ['holds', 'many things of one kind', 'one record, fixed fields'],
        ['here', 'today: the expenses', 'one expense'],
        { id: 'change', cells: ['change it?', 'yes: append', 'no: TypeError'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'printed', title: 'main.py prints, from the unpacked names', tone: 'store', rows: [
        ['2026-10-01  Café Lumen  4.50  food'], ['3 expenses today'],
      ],
    },
    {
      type: 'table', id: 'repl', title: 'The REPL', tone: 'consume', columns: ['typed', 'answer'], rows: [
        ['e = ("2026-10-01", "Metro", 2.80)', ''], { id: 'bus', cells: ['e[1] = "Bus"', 'TypeError'], tone: 'consume' },
      ],
    },
    { type: 'note', id: 't-note', tone: 'consume', text: "e[1] = \"Bus\" fails: a tuple is fixed once made. To change an expense, build a new tuple." },
  ],
  edges: [
    { from: 'tup.t0', to: 'tn.n0' }, { from: 'tup.t1', to: 'tn.n1' }, { from: 'tup.t2', to: 'tn.n2' }, { from: 'tup.t3', to: 'tn.n3' },
  ],
})

// §7 — dictionaries: a key finds its value by hashing. Slot numbers are illustrative: str hashes
// are randomised per run, so no real slot is claimed.
const dicts7 = ideFrame({
  tree, editor: { file: 'main.py', code: c7, highlight: linesFrom(c7, 'budgets = {', 'print("food budget') }, session: s7,
  side: [
    {
      type: 'group', id: 'lookup', title: 'budgets["food"]', icon: 'search', tone: 'ingest', dir: 'row', children: [
        { type: 'group', id: 'steps', bare: true, children: [
          { type: 'item', id: 'k', title: '"food"', sub: 'the key', icon: 'key' },
          { type: 'item', id: 'h', title: 'hash("food")', sub: 'a number: picks the slot', icon: 'fingerprint' },
        ] },
        { type: 'table', id: 'table', title: 'the hash table', columns: ['key', 'value'], rows: [
          { id: 'food', cells: ['food', '300'], tone: 'store' }, { id: 'transport', cells: ['transport', '80'] }, { id: 'fun', cells: ['fun', '60'] }, { id: 'rent', cells: ['rent', '950'] },
        ] },
      ],
    },
    {
      type: 'table', id: 'asks', title: 'Asking for a key', tone: 'ingest', columns: ['typed', 'answer'], rows: [
        ['budgets["food"]  (main.py)', '300'], ['budgets.get("gifts", 0)', '0'], { id: 'missing', cells: ['budgets["gifts"]', 'KeyError'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'printed', title: 'main.py prints', tone: 'store', columns: ['asked', 'answer'], rows: [
        ['budgets["food"]', '300'], ['len(budgets), after adding rent', '4'],
      ],
    },
    { type: 'item', id: 'cap', title: 'Which to use', icon: 'key', tone: 'ingest', bullets: ['d[key]: the key must be there', 'd.get(key, default): it may not be'] },
    { type: 'note', id: 'd-note', tone: 'ingest', text: 'One hash, one step: finding "food" does not walk past the other keys, however many categories Ana adds. Keys keep the order they were added.' },
  ],
  edges: [
    { from: 'k', to: 'h' },
    { from: 'h', to: 'table.food' },
  ],
})

// §8 — sets and frozendict.
const sets8 = ideFrame({
  tree, editor: { file: 'main.py', code: c8, highlight: linesFrom(c8, 'DEFAULT_BUDGETS = ', 'print("categories') }, session: s8,
  side: [
    {
      type: 'group', id: 'dedupe', title: 'seen = {food, food, transport}', icon: 'filter', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'in', columns: ['added'], rows: [{ id: 'a0', cells: ["'food'"] }, { id: 'a1', cells: ["'food'"] }, { id: 'a2', cells: ["'transport'"] }] },
        { type: 'table', id: 'set', title: 'set', columns: ['kept once'], rows: [{ id: 'sf', cells: ["'food'"] }, { id: 'st', cells: ["'transport'"] }], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'kinds', title: 'Containers so far', tone: 'ingest', columns: ['', 'order', 'duplicates', 'change'], rows: [
        ['list', 'yes', 'yes', 'yes'], ['tuple', 'yes', 'yes', 'no'], ['dict', 'keys, added order', 'keys: no', 'yes'],
        ['set', 'no: sort to print', 'no', 'yes'], { id: 'fd', cells: ['frozendict', 'added order', 'keys: no', 'no (3.15)'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'printed', title: 'main.py prints', tone: 'store', columns: ['asked', 'answer'], rows: [
        ['sorted(seen)', "['food', 'transport']"], ['"fun" in seen', 'False'],
      ],
    },
    { type: 'item', id: 'cap', title: 'Pick by the question', icon: 'filter', tone: 'ingest', bullets: ['is it in there? a set', 'what is its value? a dict', 'must it never change? frozen'] },
    { type: 'note', id: 's-note', tone: 'consume', text: 'DEFAULT_BUDGETS["fun"] = … raises TypeError: the defaults cannot be changed by accident. Ana edits her own dict copy.' },
  ],
  edges: [
    { from: 'in.a0', to: 'set.sf' }, { from: 'in.a2', to: 'set.st' },
  ],
})

// §9 — aliasing and copying ◆ refcounts.
const copy9 = ideFrame({
  tree, editor: { file: 'main.py', code: c9, highlight: [lineOf(c9, 'october =')] }, session: s9,
  side: [
    {
      type: 'group', id: 'copies', title: 'After today.append(…Bakery…)', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        names('c-names', ['october', 'shallow', 'deep'], 'names'),
        { type: 'group', id: 'dicts', bare: true, children: [
          obj('d-oct', 'dict', [['2026-10-01', '●']]), obj('d-sh', 'dict: a copy', [['2026-10-01', '●']]), obj('d-deep', 'dict: deep copy', [['2026-10-01', '●']]),
        ] },
        { type: 'group', id: 'lists', bare: true, children: [
          obj('l-shared', 'list: today', [['4 expenses'], ['refcount 4']], 'store'), obj('l-deep', 'list: its own copy', [['3 expenses']]),
        ] },
      ],
    },
    {
      type: 'table', id: 'answers', title: 'The REPL', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        ['len(shallow[…]), len(deep[…])', '(4, 3)'], { id: 'rc', cells: ['sys.getrefcount(today)', '4'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'kinds', title: 'Three ways to "copy" october', tone: 'ingest', columns: ['', 'new dict?', 'new list inside?'], rows: [
        ['b = october', 'no: an alias', 'no'], ['copy.copy(october)', 'yes', 'no: shared'], { id: 'deepr', cells: ['copy.deepcopy(october)', 'yes', 'yes'], tone: 'store' },
      ],
    },
    { type: 'item', id: 'cap', title: 'The rule', icon: 'memory', tone: 'ingest', bullets: ['copying a container copies its slots', 'not what the slots refer to'] },
    { type: 'note', id: 'c-note', tone: 'store', text: 'CPython counts references: today, october, shallow and getrefcount\'s own argument make 4. A shallow copy copies the dict, not the list inside it.' },
  ],
  edges: [
    { from: 'c-names.october', to: 'd-oct' }, { from: 'c-names.shallow', to: 'd-sh' }, { from: 'c-names.deep', to: 'd-deep' },
    { from: 'd-oct', to: 'l-shared' }, { from: 'd-sh', to: 'l-shared' }, { from: 'd-deep', to: 'l-deep' },
  ],
})

export const holdScenes: Record<string, SceneModel> = {
  'hold-names': names1, 'hold-decimal': decimal2, 'hold-strings': strings3, 'hold-none': none4, 'hold-lists': lists5,
  'hold-tuples': tuples6, 'hold-dicts': dicts7, 'hold-sets': sets8, 'hold-copying': copy9,
}
