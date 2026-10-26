import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, linesFrom } from '../ide'
import { view } from '../fold'
import { outputOf } from '../lab'
import { obj } from '../mem'
import { project } from '../start/tree'
import c1 from '../../../spine/decide/01-expressions/project/main.py?raw'
import s1 from '../../../spine/decide/01-expressions/session.txt?raw'
import c2 from '../../../spine/decide/02-if/project/main.py?raw'
import s2 from '../../../spine/decide/02-if/session.txt?raw'
import c3 from '../../../spine/decide/03-for/project/main.py?raw'
import s3 from '../../../spine/decide/03-for/session.txt?raw'
import c4 from '../../../spine/decide/04-while/project/main.py?raw'
import s4 from '../../../spine/decide/04-while/session.txt?raw'
import c5 from '../../../spine/decide/05-match/project/main.py?raw'
import s5 from '../../../spine/decide/05-match/session.txt?raw'
import c6 from '../../../spine/decide/06-comprehensions/project/main.py?raw'
import s6 from '../../../spine/decide/06-comprehensions/session.txt?raw'
import c7 from '../../../spine/decide/07-functions/project/main.py?raw'
import s7 from '../../../spine/decide/07-functions/session.txt?raw'
import s8 from '../../../spine/decide/08-memory-model/session.txt?raw'
import c9 from '../../../spine/decide/09-arguments/project/main.py?raw'
import s9 from '../../../spine/decide/09-arguments/session.txt?raw'
import c10 from '../../../spine/decide/10-scope/project/main.py?raw'
import s10 from '../../../spine/decide/10-scope/session.txt?raw'
import c11 from '../../../spine/decide/11-exceptions/project/main.py?raw'
import s11 from '../../../spine/decide/11-exceptions/session.txt?raw'

// Course 4 — make decisions, repeat, react. Every value in a side pane is in the step's session.
const tree = project('active')
const file = 'main.py'

// §1 — expressions: evaluated by precedence, then left to right.
const expressions1 = ideFrame({
  tree, editor: { file, code: c1, ...view(c1, 'expenses = [', undefined, 4), highlight: linesFrom(c1, 'spent =', 'print("transport') }, session: s1,
  side: [
    {
      type: 'group', id: 'eval', title: 'used = spent / BUDGETS["transport"] * 100', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'e1', title: 'spent / BUDGETS["transport"]', sub: '71.20 / 80, first: same rank, left to right', icon: 'code' },
        { type: 'item', id: 'e2', title: '0.89 * 100', sub: 'then the multiplication', icon: 'code' },
        { type: 'item', id: 'e3', title: 'round(89.00, 1)', sub: 'in the print: 89.0', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'prec', title: 'Precedence (the REPL)', tone: 'ingest', columns: ['typed', 'answer', 'because'], rows: [
        ['2 + 3 * 4', '14', '* before +'], ['(2 + 3) * 4', '20', 'brackets first'], ['2 ** 10', '1024', '** is power'],
      ],
    },
    {
      type: 'table', id: 'division', title: 'Three divisions', tone: 'store', columns: ['typed', 'answer', 'means'], rows: [
        ['7 / 2', '3.5', 'true division'], ['7 // 2', '3', 'floor: whole times'], ['7 % 2', '1', 'the remainder'],
      ],
    },
    { type: 'note', id: 'x-note', tone: 'ingest', text: 'Transport so far: 2.80 + 68.40 = 71.20 of an 80.00 budget. 8.80 left, 89.0 % used.' },
  ],
  edges: [{ from: 'e1', to: 'e2' }, { from: 'e2', to: 'e3' }],
})

// §2 — if / elif / else: one path lit for transport at 89 %.
const if2 = ideFrame({
  tree, editor: { file, code: c2, ...view(c2, 'expenses = [', undefined, 4), highlight: linesFrom(c2, 'if used > 100', 'print("transport: on track') }, session: s2,
  side: [
    {
      type: 'group', id: 'chart', title: 'transport: used = 89.0', icon: 'workflow', tone: 'ingest', children: [
        { type: 'group', id: 'row1', bare: true, dir: 'row', children: [
          { type: 'item', id: 'q1', title: 'used > 100?', sub: 'False', icon: 'search' },
          { type: 'item', id: 'over', title: 'over budget by …', icon: 'bell' },
        ] },
        { type: 'group', id: 'row2', bare: true, dir: 'row', children: [
          { type: 'item', id: 'q2', title: 'used >= 80?', sub: 'True', icon: 'search', tone: 'store' },
          { type: 'item', id: 'careful', title: 'careful, 8.80 left', sub: 'printed', icon: 'check', tone: 'store' },
        ] },
        { type: 'item', id: 'ok', title: 'else: on track', sub: 'skipped', icon: 'check' },
      ],
    },
    {
      type: 'table', id: 'cmp', title: 'Comparisons answer True or False', tone: 'ingest', columns: ['typed', 'answer'], rows: [
        ['used > 100, used >= 80', '(False, True)'], ['80 <= used <= 100', 'True'],
      ],
    },
    {
      type: 'table', id: 'bands', title: 'The three answers', tone: 'store', columns: ['used', 'the report says'], rows: [
        ['more than 100', 'over budget by …'], { id: 'band', cells: ['80 to 100', 'careful, … left'], tone: 'store' }, ['under 80', 'on track, … left'],
      ],
    },
    { type: 'item', id: 'cap', title: 'The order matters', icon: 'workflow', tone: 'ingest', bullets: ['the first True branch runs', 'the rest are skipped'] },
    { type: 'note', id: 'i-note', tone: 'store', text: 'elif is checked only when every test above it was False; else runs only when none was True.' },
  ],
  edges: [
    { from: 'q1', to: 'over', label: 'yes' }, { from: 'q1', to: 'q2', label: 'no' },
    { from: 'q2', to: 'careful', label: 'yes' }, { from: 'q2', to: 'ok', label: 'no' },
  ],
})

// §3 — for loops: one pass per expense, the names rebound each time. Totals computed from the data.
const for3 = ideFrame({
  tree, editor: { file, code: c3, ...view(c3, 'totals = {}', undefined, 4), highlight: linesFrom(c3, 'for date, description', 'totals[category] =') }, session: s3,
  side: [
    {
      type: 'table', id: 'passes', title: 'for date, description, amount, category in expenses', tone: 'ingest', columns: ['pass', 'category', 'amount', 'totals[category]'], rows: [
        ['1', 'food', '4.50', '4.50'], ['2', 'food', '12.99', '17.49'], ['3', 'transport', '2.80', '2.80'], ['4', 'fun', '11.50', '11.50'],
        ['5', 'food', '46.20', '63.69'], ['6', 'transport', '68.40', '71.20'], { id: 'p7', cells: ['7', 'fun', '64.00', '75.50'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'second', title: 'Then for category, spent in totals.items()', icon: 'workflow', tone: 'store', dir: 'row', children: [
        { type: 'table', id: 'totals', title: 'totals', rows: [['food', '63.69'], ['transport', '71.20'], ['fun', '75.50']] },
        { type: 'table', id: 'status', title: 'printed', rows: [{ id: 'sf', cells: ['on track, 236.31 left'] }, { id: 'st', cells: ['careful, 8.80 left'] }, { id: 'su', cells: ['over budget by 15.50'] }] },
      ],
    },
    { type: 'item', id: 'cap', title: 'Two loops', icon: 'workflow', tone: 'ingest', bullets: ['the first adds up each category', 'the second decides, once per category'] },
    { type: 'table', id: 'get', title: 'The first time a category appears', tone: 'ingest', columns: ['typed', 'gives'], rows: [['totals.get("food", 0)', '0: no total yet']] },
    { type: 'note', id: 'f-note', tone: 'ingest', text: 'Each pass unpacks the next tuple into the four names. totals.get(category, 0) starts a category at zero the first time it appears.' },
  ],
  edges: [{ from: 'totals.food', to: 'status.sf' }, { from: 'totals.transport', to: 'status.st' }, { from: 'totals.fun', to: 'status.su' }],
})

// §4 — while and input(): the loop and its two exits.
const while4 = ideFrame({
  tree, editor: { file, code: c4, ...view(c4, 'while True:', undefined, 4), highlight: linesFrom(c4, 'while True:', 'continue') }, session: s4,
  side: [
    {
      type: 'group', id: 'loop', title: 'while True: until quit', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'ask', title: 'input("expense> ")', sub: 'waits for a line', icon: 'terminal' },
        { type: 'group', id: 'r2', bare: true, dir: 'row', children: [
          { type: 'item', id: 'isquit', title: 'command == "quit"?', icon: 'search' },
          { type: 'item', id: 'brk', title: 'break', sub: 'leave the loop', icon: 'zap', tone: 'consume' },
        ] },
        { type: 'group', id: 'r3', bare: true, dir: 'row', children: [
          { type: 'item', id: 'isrep', title: 'command != "report"?', icon: 'search' },
          { type: 'item', id: 'cont', title: 'help, then continue', sub: 'back to input', icon: 'clock' },
        ] },
        { type: 'item', id: 'rep', title: 'the report', sub: 'then round again', icon: 'chart', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'typed', title: 'This session', tone: 'ingest', columns: ['typed', 'the loop'], rows: [
        ['help', 'continue'], { id: 'tr', cells: ['report', 'the report, then input again'], tone: 'store' }, { id: 'tq', cells: ['quit', 'break: the program ends'], tone: 'consume' },
      ],
    },
    { type: 'note', id: 'w-note', tone: 'ingest', text: 'A for loop walks a collection; a while loop runs until something tells it to stop. Here, that is Ana typing quit.' },
  ],
  edges: [
    { from: 'ask', to: 'isquit' }, { from: 'isquit', to: 'brk', label: 'yes' }, { from: 'isquit', to: 'isrep', label: 'no' },
    { from: 'isrep', to: 'cont', label: 'yes' }, { from: 'isrep', to: 'rep', label: 'no' },
  ],
})

// §5 — match: the command's words against each case.
const match5 = ideFrame({
  tree, editor: { file, code: c5, ...view(c5, 'while True:', undefined, 4), highlight: [lineOf(c5, 'match input'), lineOf(c5, 'case ["add"'), lineOf(c5, 'case ["report"]'), lineOf(c5, 'case ["quit"]'), lineOf(c5, 'case _:')] }, session: s5,
  side: [
    {
      type: 'group', id: 'm', title: 'input().split() against each case', icon: 'filter', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'words', title: 'the words', rows: [{ id: 'w-add', cells: ["['add', '9.80', 'fun']"] }, { id: 'w-rep', cells: ["['report']"] }, { id: 'w-quit', cells: ["['quit']"] }] },
        { type: 'table', id: 'cases', title: 'the case that matched', rows: [{ id: 'c-add', cells: ['["add", amount, category]'] }, { id: 'c-rep', cells: ['["report"]'] }, { id: 'c-quit', cells: ['["quit"]'] }] },
      ],
    },
    {
      type: 'table', id: 'bound', title: 'A pattern binds names', tone: 'store', columns: ['name', 'bound to'], rows: [['amount', "'9.80'"], ['category', "'fun'"]],
    },
    {
      type: 'table', id: 'effect', title: 'After add 9.80 fun', tone: 'ingest', columns: ['category', 'report says'], rows: [{ id: 'fun', cells: ['fun', 'over budget by 25.30'], tone: 'consume' }],
    },
    {
      type: 'table', id: 'patterns', title: 'Patterns in main.py', tone: 'ingest', columns: ['case', 'matches'], rows: [
        ['["add", amount, category]', 'three words, the first add'], ['["report"]', 'exactly one word: report'], ['_', 'anything else: the help'],
      ],
    },
    { type: 'item', id: 'cap', title: 'Why match, not if', icon: 'filter', tone: 'store', bullets: ['it checks the shape and the length', 'and names the parts in one step'] },
    { type: 'note', id: 'm-note', tone: 'ingest', text: 'match tries the cases top to bottom; a list pattern also checks the LENGTH. case _ catches anything left over.' },
  ],
  edges: [{ from: 'words.w-add', to: 'cases.c-add' }, { from: 'words.w-rep', to: 'cases.c-rep' }, { from: 'words.w-quit', to: 'cases.c-quit' }],
})

// §6 — comprehensions: the one line, and the loop it means.
const comp6 = ideFrame({
  tree, editor: { file, code: c6, ...view(c6, 'while True:', undefined, 4), highlight: [lineOf(c6, 'for row in [e'), lineOf(c6, 'spent = sum(e[2]')] }, session: s6,
  side: [
    {
      type: 'group', id: 'parts', title: '[e for e in expenses if e[3] == category]', icon: 'filter', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'comp', title: 'the comprehension', rows: [{ id: 'k1', cells: ['for e in expenses'] }, { id: 'k2', cells: ['if e[3] == category'] }, { id: 'k3', cells: ['e'] }] },
        { type: 'table', id: 'loop', title: 'the loop it means', rows: [{ id: 'l1', cells: ['for e in expenses:'] }, { id: 'l2', cells: ['    if e[3] == category:'] }, { id: 'l3', cells: ['        result.append(e)'] }] },
      ],
    },
    {
      type: 'table', id: 'kinds', title: 'Three shapes', tone: 'store', columns: ['written', 'makes'], rows: [
        ['[e for e in …]', 'a list'], ['sum(e[2] for e in …)', 'a generator, summed'], ['[*day for day in days]', 'a flat list (3.15)'],
      ],
    },
    { type: 'table', id: 'flat', title: 'The REPL: unpacking, new in 3.15', tone: 'ingest', columns: ['typed', 'answer'], rows: [['[*day for day in days]', "['coffee', 'lunch', 'metro']"]] },
    {
      type: 'table', id: 'listed', title: 'list food printed', tone: 'store', rows: [
        ['2026-10-01 Café Lumen 4.50 food'], ['2026-10-01 Noodle Bar 12.99 food'], ['2026-10-03 Corner Market 46.20 food'],
      ],
    },
    { type: 'item', id: 'cap', title: 'When to use one', icon: 'filter', tone: 'ingest', bullets: ['a filter, a transformation: yes', 'more than one test: write the loop'] },
    { type: 'note', id: 'c-note', tone: 'ingest', text: 'list food printed the three food expenses. The report now sums each category with one generator expression.' },
  ],
  edges: [{ from: 'comp.k1', to: 'loop.l1' }, { from: 'comp.k2', to: 'loop.l2' }, { from: 'comp.k3', to: 'loop.l3' }],
})

// §7 — functions ◆ the call stack: report → status → total, a frame each.
const fn7 = ideFrame({
  tree, editor: { file, code: c7, ...view(c7, 'def total(', 'print(status(', 2), highlight: [lineOf(c7, 'def total('), lineOf(c7, 'def status('), lineOf(c7, 'def report(')] }, session: s7,
  side: [
    {
      type: 'group', id: 'stack', title: 'The call stack, during total("transport")', icon: 'layers', tone: 'ingest', children: [
        obj('f-total', 'total(): top frame', [['category', "'transport'"], ['returns', '71.20']], 'store'),
        obj('f-status', 'status()', [['category', "'transport'"], ['budget', '80']]),
        obj('f-report', 'report()', [['category', "'transport'"], ['budget', '80']]),
        obj('f-module', '<module>', [['expenses', 'the list'], ['BUDGETS', 'the frozendict']]),
      ],
    },
    {
      type: 'table', id: 'returns', title: 'What each call returned', tone: 'store', columns: ['call', 'returned'], rows: [
        ['total("transport")', '71.20'], ['status("transport", 80)', "'transport: careful, 8.80 left'"],
      ],
    },
    { type: 'note', id: 'fn-note', tone: 'ingest', text: 'A call pushes a frame holding its own names; return pops it and hands back one value. report now reads as what it does.' },
  ],
  edges: [
    { from: 'f-module', to: 'f-report', label: 'calls' }, { from: 'f-report', to: 'f-status', label: 'calls' }, { from: 'f-status', to: 'f-total', label: 'calls' },
  ],
})

// §8 — ◆ full scene: the memory model. The stack and its names → the heap's objects, from a lab
// run (inspect.stack, f_locals, getrefcount). CPython.
const lab = outputOf(s8, 'python memory.py')
const memory8: SceneModel = {
  title: 'The memory model',
  sub: 'CPython 3.15.1: frames on the stack hold names; every object lives on the heap',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'left', bare: true, children: [
        {
          type: 'group', id: 'stack', title: 'The stack', sub: 'one frame per running call, top first', icon: 'layers', tone: 'ingest', children: [
            { type: 'table', id: 'fr-total', title: 'total', rows: [{ id: 'category', cells: ['category', '●'] }, { id: 'frames', cells: ['frames', '●'] }] },
            { type: 'table', id: 'fr-report', title: 'report', rows: [{ id: 'spent', cells: ['spent', '(not yet)'] }] },
            { type: 'table', id: 'fr-module', title: '<module>', rows: [{ id: 'expenses', cells: ['expenses', '●'] }, { id: 'total', cells: ['total', '●'] }, { id: 'report', cells: ['report', '●'] }] },
          ],
        },
        { type: 'code', id: 'run', terminal: true, filename: 'python memory.py', code: `$ python memory.py\n${lab}` },
      ],
    },
    {
      type: 'group', id: 'heap', title: 'The heap', sub: 'every object: a type, a value, a reference count', icon: 'memory', tone: 'store', dir: 'row', children: [
        { type: 'group', id: 'heap-a', bare: true, children: [
          { type: 'table', id: 'h-str', title: 'str', rows: [["'food'"]] },
          { type: 'table', id: 'h-list', title: 'list: frames', rows: [["['total', 'report', '<module>']"]] },
          { type: 'table', id: 'h-exp', title: 'list: expenses · refcount 2', rows: [{ id: 'slot', cells: ['[0]', '●'] }] },
          { type: 'table', id: 'h-fns', title: 'function objects', rows: [['total', 'report']] },
        ] },
        { type: 'table', id: 'h-tuple', title: 'tuple', rows: [["'2026-10-01'"], ["'Café Lumen'"], ["Decimal('4.50')"], ["'food'"]] },
      ],
    },
  ],
  edges: [
    { from: 'fr-total.category', to: 'h-str' },
    { from: 'fr-total.frames', to: 'h-list' },
    { from: 'fr-module.expenses', to: 'h-exp' },
    { from: 'h-exp.slot', to: 'h-tuple' },
    { from: 'fr-module.total', to: 'h-fns' },
  ],
}

// §9 — arguments, and the mutable default (shown in the REPL).
const args9 = ideFrame({
  tree, editor: { file, code: c9, ...view(c9, 'def add_expense(', undefined, 2), highlight: linesFrom(c9, 'def add_expense(', 'return len(expenses)').concat([lineOf(c9, 'count = add_expense(')]) }, session: s9,
  side: [
    {
      type: 'group', id: 'trap', title: 'def tag(word, tags=[]): made ONCE', icon: 'memory', tone: 'consume', dir: 'row', children: [
        { type: 'table', id: 'calls', title: 'two calls', rows: [{ id: 'c1', cells: ['tag("bakery")', 'tags ●'] }, { id: 'c2', cells: ['tag("metro")', 'tags ●'] }] },
        obj('shared', 'the one default list', [['bakery'], ['metro']], 'consume'),
      ],
    },
    {
      type: 'table', id: 'bind', title: 'add 3.20 food bakery near work', tone: 'ingest', columns: ['parameter', 'gets', 'how'], rows: [
        ['amount', 'Decimal("3.20")', 'by position'], ['category', "'food'", 'by position'],
        ['description', "'bakery near work'", 'by position'], { id: 'dt', cells: ['date', "'2026-10-06'", 'the default'], tone: 'store' },
      ],
    },
    { type: 'table', id: 'printed', title: 'The app answered', tone: 'store', rows: [['added 3.20 to food | expenses: 8']] },
    {
      type: 'table', id: 'fix', title: 'The safe default', tone: 'store', columns: ['write', 'so that'], rows: [
        ['tags=None', 'nothing shared between calls'], ['if tags is None: tags = []', 'each call gets a new list'],
      ],
    },
    { type: 'item', id: 'cap', title: 'Defaults', icon: 'key', tone: 'store', bullets: ['are made once, with the def', 'so make them immutable: a str, None'] },
    { type: 'note', id: 'a-note', tone: 'consume', text: "The second call returned ['bakery', 'metro']: both calls appended to the same list. Use tags=None, then make a new list inside." },
  ],
  edges: [{ from: 'calls.c1', to: 'shared' }, { from: 'calls.c2', to: 'shared' }],
})

// §10 — scope: LEGB. Reading a global works; assigning to one makes a new local.
const scope10 = ideFrame({
  tree, editor: { file, code: c10, ...view(c10, 'def add_expense(', undefined, 2), highlight: [lineOf(c10, 'added += 1')] }, session: s10,
  side: [
    {
      type: 'group', id: 'legb', title: 'Where Python looks for a name: L, E, G, B', icon: 'search', tone: 'ingest', children: [
        { type: 'table', id: 'local', title: 'L: add_expense, local', tone: 'consume', rows: [['amount, category, description, date'], { id: 'added', cells: ['added: local, no value yet'], tone: 'consume' }] },
        { type: 'table', id: 'enclosing', title: 'E: enclosing functions', rows: [['none here']] },
        { type: 'table', id: 'global', title: 'G: main.py, global', tone: 'store', rows: [{ id: 'g-added', cells: ['added = 0'] }, { id: 'g-warn', cells: ['WARN_AT = 80'] }, ['expenses, BUDGETS, …'] ] },
        { type: 'table', id: 'builtin', title: 'B: built-ins', rows: [['print, len, sum, input, …']] },
      ],
    },
    {
      type: 'table', id: 'rules', title: 'Two rules', tone: 'ingest', columns: ['in a function', 'the name is'], rows: [
        ['only read: WARN_AT', 'found in G'], { id: 'assign', cells: ['assigned: added += 1', 'local, everywhere in it'], tone: 'consume' },
      ],
    },
    { type: 'note', id: 's-note', tone: 'consume', text: 'added += 1 assigns, so added is local to add_expense, and it has no value to add to. global added (next) says: use the module\'s name.' },
  ],
  edges: [{ from: 'local', to: 'enclosing' }, { from: 'enclosing', to: 'global' }, { from: 'global', to: 'builtin' }],
})

// §11 — exceptions: raised in parse_amount, caught one frame up in the loop.
const exc11 = ideFrame({
  tree, editor: { file, code: c11, ...view(c11, 'class InvalidAmount', undefined, 2), highlight: linesFrom(c11, 'class InvalidAmount', 'return amount') }, session: s11,
  side: [
    {
      type: 'group', id: 'travel', title: 'add -3 fun: the exception travels up', icon: 'layers', tone: 'ingest', children: [
        obj('fr-parse', 'parse_amount("-3")', [['raise InvalidAmount(…)']], 'consume'),
        obj('fr-loop', '<module>: the loop', [['except InvalidAmount as error:'], ['print("not added:", error)']], 'store'),
      ],
    },
    {
      type: 'table', id: 'tries', title: 'This session', tone: 'ingest', columns: ['typed', 'result'], rows: [
        { id: 'comma', cells: ['add 12,50 food lunch', "not a number: '12,50'"], tone: 'consume' },
        { id: 'neg', cells: ['add -3 fun', 'must be more than zero: -3'], tone: 'consume' },
        { id: 'good', cells: ['add 12.50 food lunch', 'added: expenses 8'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'family', title: 'Our own exception', tone: 'store', columns: ['class', 'is a'], rows: [['InvalidAmount', 'ValueError'], ['ValueError', 'Exception']],
    },
    { type: 'item', id: 'cap', title: 'The shape of robust code', icon: 'shield', tone: 'store', bullets: ['check early, raise a specific error', 'catch it where you can say why'] },
    { type: 'note', id: 'e-note', tone: 'ingest', text: 'try runs the risky line; except catches one kind of error; else runs only when nothing was raised. The app keeps going.' },
  ],
  edges: [{ from: 'fr-parse', to: 'fr-loop', label: 'raises' }],
})

export const decideScenes: Record<string, SceneModel> = {
  'decide-expressions': expressions1, 'decide-if': if2, 'decide-for': for3, 'decide-while': while4, 'decide-match': match5,
  'decide-comprehensions': comp6, 'decide-functions': fn7, 'decide-memory-model': memory8, 'decide-arguments': args9,
  'decide-scope': scope10, 'decide-exceptions': exc11,
}
