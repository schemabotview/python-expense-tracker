import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { names, obj } from '../mem'
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

// Course 3 — hold the data, on IDE frame v2: the side pane is titled with the section's mental
// model and holds one diagram and at most one table. Every value in it is in the step's session or
// main.py.
// The v2 explorer is compact (175px): the venv is one muted folder, without v1's note.
const tree: TreeEntry[] = [{ name: '.venv', folder: true, state: 'muted' }, { name: 'main.py', state: 'active' }]

// §1 — names and objects ◆ the heap: a rebind moves one arrow.
const names1 = ideFrame2({
  model: 'A name is an arrow to an object', tree, editor: { file: 'main.py', code: c1, highlight: linesFrom(c1, 'date =', 'category =') }, session: s1,
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
        { type: 'group', id: 'a-objs', bare: true, children: [obj('a-52', 'float: new', [['5.2']], 'store'), obj('a-45', 'float', [['4.5']])] },
      ],
    },
    {
      type: 'table', id: 'answers', title: 'The REPL answers', tone: 'store', columns: ['typed', 'answer'], rows: [
        ['paid', '4.5'], { id: 'is', cells: ['paid is amount', 'False'], tone: 'store' },
      ],
    },
  ],
  edges: [
    { from: 'b-names.amount', to: 'b-45' }, { from: 'b-names.paid', to: 'b-45' },
    { from: 'a-names.amount', to: 'a-52' }, { from: 'a-names.paid', to: 'a-45' },
  ],
})

// §2 — numbers, and why money is a Decimal.
const decimal2 = ideFrame2({
  model: 'A float is approximate; a Decimal is exact', tree,
  editor: { file: 'main.py', code: c2, highlight: [lineOf(c2, 'amount ='), lineOf(c2, 'lunch =')] }, session: s2,
  side: [
    { type: 'item', id: 'typed', icon: 'code', tone: 'neutral', title: '0.1, typed', sub: 'one tenth, in decimal' },
    {
      type: 'group', id: 'stored', bare: true, dir: 'row', children: [
        { type: 'item', id: 'f', icon: 'cpu', tone: 'consume', title: 'float', sub: 'stored in binary: 0.1000000000000000055…' },
        { type: 'item', id: 'd', icon: 'card', tone: 'store', title: 'Decimal("0.1")', sub: 'stored in decimal: 0.1, exactly' },
      ],
    },
    {
      type: 'table', id: 'sums', title: '0.1 + 0.2, both ways', tone: 'ingest', columns: ['as a', 'answer'], rows: [
        { id: 'sf', cells: ['float', '0.30000000000000004'], tone: 'consume' }, { id: 'sd', cells: ['Decimal', '0.3'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'typed', to: 'f' }, { from: 'typed', to: 'd' }],
})

// §3 — strings: a date is indexed characters; a slice is a new string.
const DATE = '2026-10-01'.split('')
const strings3 = ideFrame2({
  model: 'Indexed characters; a slice is a new string', tree,
  editor: { file: 'main.py', code: c3, highlight: linesFrom(c3, 'month =', 'print(f"month') }, session: s3,
  side: [
    {
      type: 'table', id: 'cells', title: 'date = "2026-10-01"', tone: 'ingest', columns: DATE,
      rows: [{ id: 'pos', cells: DATE.map((_, i) => String(i)) }, { id: 'neg', cells: DATE.map((_, i) => (i >= 8 ? String(i - 10) : '')) }],
    },
    {
      type: 'group', id: 'slices', title: '[start:stop]: stop not included', icon: 'filter', tone: 'store', dir: 'row', children: [
        { type: 'table', id: 'exprs', columns: ['slice'], rows: [{ id: 'mo', cells: ['date[:7]'] }, { id: 'mm', cells: ['date[5:7]'] }, { id: 'dd', cells: ['date[-2:]'] }] },
        { type: 'table', id: 'results', columns: ['a new string'], rows: [{ id: 'r-mo', cells: ["'2026-10'"] }, { id: 'r-mm', cells: ["'10'"] }, { id: 'r-dd', cells: ["'01'"] }] },
      ],
    },
  ],
  edges: [
    { from: 'exprs.mo', to: 'results.r-mo' }, { from: 'exprs.mm', to: 'results.r-mm' }, { from: 'exprs.dd', to: 'results.r-dd' },
  ],
})

// §4 — None and sentinels: "no value" and "not given" are different states.
const none4 = ideFrame2({
  model: 'Three states of a field', tree,
  editor: { file: 'main.py', code: c4, highlight: [lineOf(c4, 'note = None'), lineOf(c4, 'receipt =')] }, session: s4,
  side: [
    { type: 'item', id: 'st-value', title: 'a value', sub: 'note = "client lunch"', icon: 'file', tone: 'store' },
    { type: 'item', id: 'st-none', title: 'None: asked, nothing there', sub: 'test it with: note is None', icon: 'box' },
    { type: 'item', id: 'st-sentinel', title: 'NOT_ASKED: never asked', sub: 'a 3.15 sentinel: receipt is NOT_ASKED', icon: 'key', tone: 'consume' },
    {
      type: 'table', id: 'truthy', title: 'Why not just "if note"? (the REPL)', tone: 'consume', columns: ['typed', 'answer'], rows: [
        ['bool(None)', 'False'], ['bool(0.0)', 'False'], ['bool("")', 'False'], ['bool([])', 'False'],
      ],
    },
  ],
  edges: [
    { from: 'st-value', to: 'st-none', label: 'or' },
    { from: 'st-none', to: 'st-sentinel', label: 'or' },
  ],
})

// §5 — lists: slots that refer to objects, in order.
const lists5 = ideFrame2({
  model: 'A list is slots that refer to objects', tree,
  editor: { file: 'main.py', code: c5, highlight: linesFrom(c5, 'today = [', 'today.append') }, session: s5,
  side: [
    {
      type: 'group', id: 'heap', title: 'today: one list, three slots', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        names('l-names', ['today']),
        { type: 'table', id: 'slots', title: 'list', rows: [{ id: 's0', cells: ['0', '●'] }, { id: 's1', cells: ['1', '●'] }, { id: 's2', cells: ['2', '●'], tone: 'store' }] },
        { type: 'group', id: 'vals', bare: true, children: [obj('v0', 'Decimal', [['4.50']]), obj('v1', 'Decimal', [['12.99']]), obj('v2', 'appended', [['2.80']], 'store')] },
      ],
    },
    {
      type: 'table', id: 'ops', title: 'Asked of a list', tone: 'ingest', columns: ['typed', 'answer'], rows: [
        ['today[0], today[-1]', "('coffee', 'metro')"], ['today[1:]', "['lunch', 'metro']"], ['len(today)', '3'], ['sum(today)', '20.29'],
      ],
    },
  ],
  edges: [
    { from: 'l-names.today', to: 'slots' },
    { from: 'slots.s0', to: 'v0' }, { from: 'slots.s1', to: 'v1' }, { from: 'slots.s2', to: 'v2' },
  ],
})

// §6 — tuples and unpacking: one record, four names.
const tuples6 = ideFrame2({
  model: 'One record, four names', tree, editor: { file: 'main.py', code: c6, highlight: [lineOf(c6, 'date, description')] }, session: s6,
  side: [
    {
      type: 'group', id: 'unpack', title: '… = today[0]: unpacking', icon: 'boxes', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'tup', title: 'a tuple', rows: [
          { id: 't0', cells: ["'2026-10-01'"] }, { id: 't1', cells: ["'Café Lumen'"] }, { id: 't2', cells: ['4.50'] }, { id: 't3', cells: ["'food'"] },
        ] },
        { type: 'table', id: 'tn', title: 'names', rows: [
          { id: 'n0', cells: ['date'] }, { id: 'n1', cells: ['description'] }, { id: 'n2', cells: ['amount'] }, { id: 'n3', cells: ['category'] },
        ] },
      ],
    },
    {
      type: 'table', id: 'lt', title: 'list or tuple?', tone: 'ingest', columns: ['', 'list', 'tuple'], rows: [
        ['holds', 'many of one kind', 'one record'],
        ['here', 'the day', 'one expense'],
        { id: 'change', cells: ['change it?', 'append', 'TypeError'], tone: 'consume' },
      ],
    },
  ],
  edges: [
    { from: 'tup.t0', to: 'tn.n0' }, { from: 'tup.t1', to: 'tn.n1' }, { from: 'tup.t2', to: 'tn.n2' }, { from: 'tup.t3', to: 'tn.n3' },
  ],
})

// §7 — dictionaries: a key finds its value by hashing. Slot order is illustrative: str hashes are
// randomised per run, so no real slot is claimed.
const dicts7 = ideFrame2({
  model: 'A key finds its value by its hash', tree,
  editor: { file: 'main.py', code: c7, highlight: [lineOf(c7, 'budgets = {'), lineOf(c7, 'budgets["rent"]')] }, session: s7,
  side: [
    {
      type: 'group', id: 'lookup', title: 'budgets["food"]', icon: 'search', tone: 'ingest', dir: 'row', children: [
        { type: 'group', id: 'steps', bare: true, children: [
          { type: 'item', id: 'k', title: '"food"', sub: 'the key', icon: 'key' },
          { type: 'item', id: 'h', title: 'hash(…)', sub: 'picks the slot', icon: 'fingerprint' },
        ] },
        { type: 'table', id: 'table', title: 'hash table', rows: [
          { id: 'food', cells: ['food', '300'], tone: 'store' }, { id: 'transport', cells: ['transport', '80'] }, { id: 'fun', cells: ['fun', '60'] }, { id: 'rent', cells: ['rent', '950'] },
        ] },
      ],
    },
    {
      type: 'table', id: 'asks', title: 'Asking for a key', tone: 'ingest', columns: ['typed', 'answer'], rows: [
        ['budgets["food"]', '300'], ['budgets.get("gifts", 0)', '0'], { id: 'missing', cells: ['budgets["gifts"]', 'KeyError'], tone: 'consume' },
      ],
    },
  ],
  edges: [{ from: 'k', to: 'h' }, { from: 'h', to: 'table.food' }],
})

// §8 — sets and frozendict.
const sets8 = ideFrame2({
  model: 'A set keeps each thing once', tree,
  editor: { file: 'main.py', code: c8, highlight: [lineOf(c8, 'DEFAULT_BUDGETS = '), lineOf(c8, 'seen = ')] }, session: s8,
  side: [
    {
      type: 'group', id: 'dedupe', title: "today's categories", icon: 'filter', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'in', columns: ['added'], rows: [{ id: 'a0', cells: ["'food'"] }, { id: 'a1', cells: ["'food' again: dropped"], tone: 'consume' }, { id: 'a2', cells: ["'transport'"] }] },
        { type: 'table', id: 'set', title: 'the set', columns: ['kept once'], rows: [{ id: 'sf', cells: ["'food'"] }, { id: 'st', cells: ["'transport'"] }], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'kinds', title: 'The containers', tone: 'ingest', columns: ['', 'order', 'dupes', 'change'], rows: [
        ['list', 'yes', 'yes', 'yes'], ['tuple', 'yes', 'yes', 'no'], ['dict', 'added', 'keys: no', 'yes'],
        ['set', 'no', 'no', 'yes'], { id: 'fd', cells: ['frozendict', 'added', 'keys: no', 'no'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'in.a0', to: 'set.sf' }, { from: 'in.a2', to: 'set.st' }],
})

// §9 — aliasing and copying ◆ refcounts.
const copy9 = ideFrame2({
  model: 'Copying a container copies its slots', tree, editor: { file: 'main.py', code: c9, highlight: [lineOf(c9, 'october =')] }, session: s9,
  side: [
    {
      type: 'group', id: 'copies', title: 'After the bakery is appended', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        names('c-names', ['october', 'shallow', 'deep'], 'names'),
        { type: 'group', id: 'dicts', bare: true, children: [obj('d-oct', 'dict', [['●']]), obj('d-sh', 'a copy', [['●']]), obj('d-deep', 'deep copy', [['●']])] },
        { type: 'group', id: 'lists', bare: true, children: [obj('l-shared', 'today', [['4 expenses'], ['refcount 4']], 'store'), obj('l-deep', 'its own', [['3 expenses']])] },
      ],
    },
    {
      type: 'table', id: 'kinds', title: 'Three ways to "copy"', tone: 'ingest', columns: ['', 'new dict?', 'new list?'], rows: [
        ['b = october', 'no', 'no'], ['copy.copy', 'yes', 'no: shared'], { id: 'deepr', cells: ['copy.deepcopy', 'yes', 'yes'], tone: 'store' },
      ],
    },
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
