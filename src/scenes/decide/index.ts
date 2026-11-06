import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { outputOf } from '../lab'
import { obj } from '../mem'
import { project2 } from '../start/tree'
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

// Course 4 — make decisions, repeat, react, on IDE frame v2: each side pane is titled with the
// section's mental model and holds one diagram and at most one table. Every value in it is in the
// step's session.
const tree = project2('active')
const file = 'main.py'

// §1 — expressions: evaluated by precedence, then left to right.
const expressions1 = ideFrame2({
  model: 'Operators run by precedence, then left to right', tree, editor: { file, code: c1, highlight: linesFrom(c1, 'spent =', 'print("transport') }, session: s1,
  side: [
    {
      type: 'group', id: 'eval', title: 'used = spent / BUDGETS["transport"] * 100', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'e1', title: 'spent / BUDGETS["transport"]', sub: '71.20 / 80, first: same rank, left to right', icon: 'code' },
        { type: 'item', id: 'e2', title: '0.89 * 100', sub: 'then the multiplication', icon: 'code' },
        { type: 'item', id: 'e3', title: 'round(89.00, 1)', sub: 'in the print: 89.0', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'division', title: 'Three divisions', tone: 'store', columns: ['typed', 'answer', 'means'], rows: [
        ['7 / 2', '3.5', 'true division'], ['7 // 2', '3', 'floor: whole times'], ['7 % 2', '1', 'the remainder'],
      ],
    },
  ],
  edges: [{ from: 'e1', to: 'e2' }, { from: 'e2', to: 'e3' }],
})

// §2 — if / elif / else: one path lit for transport at 89 %.
const if2 = ideFrame2({
  model: 'The first true branch runs; the rest are skipped', tree, editor: { file, code: c2, highlight: linesFrom(c2, 'if used > 100', 'print("transport: on track') }, session: s2,
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
  ],
  edges: [
    { from: 'q1', to: 'over', label: 'yes' }, { from: 'q1', to: 'q2', label: 'no' },
    { from: 'q2', to: 'careful', label: 'yes' }, { from: 'q2', to: 'ok', label: 'no' },
  ],
})

// §3 — for loops: one pass per expense, the names rebound each time. Totals computed from the data.
const for3 = ideFrame2({
  model: 'One pass per item, the names rebound', tree, editor: { file, code: c3, highlight: linesFrom(c3, 'for date, description', 'totals[category] =') }, session: s3,
  side: [
    {
      type: 'table', id: 'passes', title: 'for date, description, amount, category in expenses', tone: 'ingest', columns: ['pass', 'category', 'amount', 'totals[category]'], rows: [
        ['1', 'food', '4.50', '4.50'], ['2', 'food', '12.99', '17.49'], ['3', 'transport', '2.80', '2.80'], ['4', 'fun', '11.50', '11.50'],
        ['5', 'food', '46.20', '63.69'], ['6', 'transport', '68.40', '71.20'], { id: 'p7', cells: ['7', 'fun', '64.00', '75.50'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'second', title: 'then: for … in totals.items()', icon: 'workflow', tone: 'store', dir: 'row', children: [
        { type: 'table', id: 'totals', title: 'totals', rows: [['food', '63.69'], ['transport', '71.20'], ['fun', '75.50']] },
        { type: 'table', id: 'status', title: 'printed', rows: [{ id: 'sf', cells: ['on track'] }, { id: 'st', cells: ['careful'] }, { id: 'su', cells: ['over budget'] }] },
      ],
    },
  ],
  edges: [{ from: 'totals.food', to: 'status.sf' }, { from: 'totals.transport', to: 'status.st' }, { from: 'totals.fun', to: 'status.su' }],
})

// §4 — while and input(): the loop and its two exits.
const while4 = ideFrame2({
  model: 'Round and round until break', tree, editor: { file, code: c4, highlight: linesFrom(c4, 'while True:', 'continue') }, session: s4,
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
  ],
  edges: [
    { from: 'ask', to: 'isquit' }, { from: 'isquit', to: 'brk', label: 'yes' }, { from: 'isquit', to: 'isrep', label: 'no' },
    { from: 'isrep', to: 'cont', label: 'yes' }, { from: 'isrep', to: 'rep', label: 'no' },
  ],
})

// §5 — match: the command's words against each case.
const match5 = ideFrame2({
  model: 'The first case whose shape fits', tree, editor: { file, code: c5, highlight: [lineOf(c5, 'match input'), lineOf(c5, 'case ["add"'), lineOf(c5, 'case ["report"]'), lineOf(c5, 'case ["quit"]')],
    // the cases, each with its first line: three folds keep it inside the run editor's 9 rows
    show: [[lineOf(c5, 'match input'), lineOf(c5, 'case ["add"')], [lineOf(c5, 'case ["report"]'), lineOf(c5, 'case ["report"]')], [lineOf(c5, 'case ["quit"]'), lineOf(c5, 'case ["quit"]') + 1]] }, session: s5,
  side: [
    {
      type: 'group', id: 'm', bare: true, dir: 'row', children: [
        { type: 'table', id: 'words', title: 'typed', rows: [{ id: 'w-add', cells: ['add 9.80 fun'] }, { id: 'w-rep', cells: ['report'] }, { id: 'w-quit', cells: ['quit'] }] },
        { type: 'table', id: 'cases', title: 'the case it matched', rows: [{ id: 'c-add', cells: ['["add", amount, category]'] }, { id: 'c-rep', cells: ['["report"]'] }, { id: 'c-quit', cells: ['["quit"]'] }] },
      ],
    },
    {
      type: 'table', id: 'bound', title: 'A pattern binds names', tone: 'store', columns: ['name', 'bound to'], rows: [['amount', "'9.80'"], ['category', "'fun'"]],
    },
  ],
  edges: [{ from: 'words.w-add', to: 'cases.c-add' }, { from: 'words.w-rep', to: 'cases.c-rep' }, { from: 'words.w-quit', to: 'cases.c-quit' }],
})

// §6 — comprehensions: the one line, and the loop it means.
const comp6 = ideFrame2({
  model: 'A comprehension is a loop, written as an expression', tree, editor: { file, code: c6, highlight: [lineOf(c6, 'for row in [e'), lineOf(c6, 'spent = sum(e[2]')] }, session: s6,
  side: [
    { type: 'item', id: 'k1', icon: 'workflow', tone: 'neutral', title: 'for e in expenses', sub: 'the for clause: the loop' },
    { type: 'item', id: 'k2', icon: 'filter', tone: 'ingest', title: 'if e[3] == category', sub: 'the if clause: the test inside it' },
    { type: 'item', id: 'k3', icon: 'check', tone: 'store', title: '[e …]', sub: 'the front: what each pass appends' },
    {
      type: 'table', id: 'kinds', title: 'Three shapes', tone: 'store', columns: ['written', 'makes'], rows: [
        ['[e for e in …]', 'a list'], ['sum(e[2] for e in …)', 'a generator, summed'], ['[*day for day in days]', 'a flat list (3.15)'],
      ],
    },
  ],
  edges: [{ from: 'k1', to: 'k2', label: 'each e' }, { from: 'k2', to: 'k3', label: 'True' }],
})

// §7 — functions ◆ the call stack: report → status → total, a frame each.
const fn7 = ideFrame2({
  model: 'Each call gets a frame; return pops it', tree, editor: { file, code: c7, highlight: [lineOf(c7, 'def total('), lineOf(c7, 'def status('), lineOf(c7, 'def report(')] }, session: s7,
  side: [
    {
      type: 'group', id: 'stack', title: 'The call stack, during total("transport")', icon: 'layers', tone: 'ingest', children: [
        obj('f-total', 'total(): top frame', [['category', "'transport'"], ['returns', '71.20']], 'store'),
        obj('f-status', 'status()', [['category', "'transport'"], ['budget', '80']]),
        obj('f-report', 'report()', [['category', "'transport'"], ['budget', '80']]),
        obj('f-module', '<module>', [['expenses', 'the list'], ['BUDGETS', 'the frozendict']]),
      ],
    },
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
const args9 = ideFrame2({
  model: 'A default is made once, with the def', tree, editor: { file, code: c9, highlight: linesFrom(c9, 'def add_expense(', 'return len(expenses)').concat([lineOf(c9, 'count = add_expense(')]),
    show: [[lineOf(c9, 'def add_expense('), lineOf(c9, 'return len(expenses)')], [lineOf(c9, 'count = add_expense('), lineOf(c9, 'count = add_expense(')]] }, session: s9,
  side: [
    {
      type: 'group', id: 'trap', title: 'tags=[]: made ONCE', icon: 'memory', tone: 'consume', dir: 'row', children: [
        { type: 'table', id: 'calls', title: 'two calls', rows: [{ id: 'c1', cells: ['tag("bakery")', '●'] }, { id: 'c2', cells: ['tag("metro")', '●'] }] },
        obj('shared', 'the one default list', [['bakery'], ['metro']], 'consume'),
      ],
    },
    {
      type: 'table', id: 'bind', title: 'add 3.20 food bakery near work', tone: 'ingest', columns: ['parameter', 'gets', 'how'], rows: [
        ['amount', 'Decimal("3.20")', 'position'], ['category', "'food'", 'position'],
        ['description', "'bakery near work'", 'position'], { id: 'dt', cells: ['date', "'2026-10-06'", 'default'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'calls.c1', to: 'shared' }, { from: 'calls.c2', to: 'shared' }],
})

// §10 — scope: LEGB. Reading a global works; assigning to one makes a new local.
const scope10 = ideFrame2({
  model: 'L, E, G, B: the first scope with the name', tree, editor: { file, code: c10, highlight: [lineOf(c10, 'added += 1')] }, session: s10,
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
        ['reads WARN_AT', 'found in G'], { id: 'assign', cells: ['added += 1', 'local, in all of it'], tone: 'consume' },
      ],
    },
  ],
  edges: [{ from: 'local', to: 'enclosing' }, { from: 'enclosing', to: 'global' }, { from: 'global', to: 'builtin' }],
})

// §11 — exceptions: raised in parse_amount, caught one frame up in the loop.
const exc11 = ideFrame2({
  model: 'An exception travels up to an except', tree, editor: { file, code: c11, highlight: [lineOf(c11, 'raise InvalidAmount(f"not'), lineOf(c11, 'raise InvalidAmount(f"must'), lineOf(c11, 'except InvalidAmount'), lineOf(c11, 'print("not added')],
    // where it is raised, and where it is caught: the diagram's two frames
    show: [[lineOf(c11, 'raise InvalidAmount(f"not'), lineOf(c11, 'raise InvalidAmount(f"must')], [lineOf(c11, 'except InvalidAmount'), lineOf(c11, 'print("not added')]] }, session: s11,
  side: [
    {
      type: 'group', id: 'travel', title: 'add -3 fun: the exception travels up', icon: 'layers', tone: 'ingest', children: [
        obj('fr-parse', 'parse_amount("-3")', [['raise InvalidAmount(…)']], 'consume'),
        obj('fr-loop', '<module>: the loop', [['except InvalidAmount as error:'], ['print("not added:", error)']], 'store'),
      ],
    },
    {
      type: 'table', id: 'tries', title: 'This session', tone: 'ingest', columns: ['typed', 'result'], rows: [
        { id: 'comma', cells: ['add 12,50 food lunch', 'not a number'], tone: 'consume' },
        { id: 'neg', cells: ['add -3 fun', 'not more than zero'], tone: 'consume' },
        { id: 'good', cells: ['add 12.50 food lunch', 'added'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'fr-parse', to: 'fr-loop', label: 'raises' }],
})

export const decideScenes: Record<string, SceneModel> = {
  'decide-expressions': expressions1, 'decide-if': if2, 'decide-for': for3, 'decide-while': while4, 'decide-match': match5,
  'decide-comprehensions': comp6, 'decide-functions': fn7, 'decide-memory-model': memory8, 'decide-arguments': args9,
  'decide-scope': scope10, 'decide-exceptions': exc11,
}
