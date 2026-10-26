import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, linesFrom } from '../ide'
import { view } from '../fold'
import { venvClosed } from '../start/tree'
import c1 from '../../../spine/report/01-regex/project/main.py?raw'
import s1 from '../../../spine/report/01-regex/session.txt?raw'
import c2 from '../../../spine/report/02-counter/project/main.py?raw'
import s2 from '../../../spine/report/02-counter/session.txt?raw'
import c3 from '../../../spine/report/03-sorting/project/main.py?raw'
import s3 from '../../../spine/report/03-sorting/session.txt?raw'
import c4 from '../../../spine/report/04-dates/project/main.py?raw'
import s4 from '../../../spine/report/04-dates/session.txt?raw'
import d4 from '../../../spine/report/04-dates/project/data/expenses.json?raw'
import c5 from '../../../spine/report/05-recurring/project/main.py?raw'
import s5 from '../../../spine/report/05-recurring/session.txt?raw'
import c6 from '../../../spine/report/06-generators/project/main.py?raw'
import s6 from '../../../spine/report/06-generators/session.txt?raw'
import c7 from '../../../spine/report/07-formatting/project/main.py?raw'
import s7 from '../../../spine/report/07-formatting/session.txt?raw'

// Course 6 — categorise and report. Values are the sessions' output, or computed from the step's
// own data/expenses.json (the per-day plot), never typed.
const file = 'main.py'
const tree: TreeEntry[] = [
  venvClosed,
  { name: 'data', children: [{ name: 'bank', folder: true }, { name: 'expenses.json' }] },
  { name: 'main.py', state: 'active' },
]

// §1 — regular expressions: a bank's description → a category.
const regex1 = ideFrame({
  tree, editor: { file, code: c1, ...view(c1, 'RULES = [', 'return "other"', 3), highlight: linesFrom(c1, 'RULES = [', ']').concat(linesFrom(c1, 'def categorise(', 'return "other"')) }, session: s1,
  side: [
    {
      type: 'group', id: 'map', title: 'categorise(description): the first rule that matches', icon: 'filter', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'descs', title: 'from the bank', rows: [
          { id: 'amzn', cells: ['AMZN MKTP UK*2K4'] }, { id: 'tfl', cells: ['TFL TRAVEL CH'] }, { id: 'nflx', cells: ['NETFLIX.COM'] },
          { id: 'water', cells: ['THAMES WATER'] }, { id: 'cafe', cells: ['CAFÉ MÜLLER'] },
        ] },
        { type: 'table', id: 'cats', title: 'category', rows: [
          { id: 'shopping', cells: ['shopping'] }, { id: 'transport', cells: ['transport'] }, { id: 'fun', cells: ['fun'] },
          { id: 'bills', cells: ['bills'] }, { id: 'food', cells: ['food'] },
        ] },
      ],
    },
    {
      type: 'table', id: 'syntax', title: 'The pattern language, as used here', tone: 'store', columns: ['written', 'matches'], rows: [
        ['^AMZN MKTP', 'AMZN MKTP at the START'], ['TESCO|PRET', 'TESCO or PRET'], ['CAF[EÉ]', 'CAFE or CAFÉ'],
      ],
    },
    {
      type: 'table', id: 'repl', title: 'The REPL', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        ['re.search(r"^AMZN MKTP", …)', "match='AMZN MKTP'"], ['categorise("BAKERY")', "'other'"],
      ],
    },
    { type: 'table', id: 'ran', title: 'The app answered', tone: 'store', rows: [['categorised 12 expenses'], ['2026-10-07 AMZN MKTP UK*2K4 15.99 shopping'], ['saved 20 expenses to data/expenses.json']] },
    { type: 'note', id: 'r-note', tone: 'store', text: 'categorise filed all 12 imported expenses that were other. Rules are data: a new shop is one more line in RULES.' },
  ],
  edges: [
    { from: 'descs.amzn', to: 'cats.shopping' }, { from: 'descs.tfl', to: 'cats.transport' }, { from: 'descs.nflx', to: 'cats.fun' },
    { from: 'descs.water', to: 'cats.bills' }, { from: 'descs.cafe', to: 'cats.food' },
  ],
})

// §2 — grouping with defaultdict, counting with Counter.
const counter2 = ideFrame({
  tree, editor: { file, code: c2, ...view(c2, 'def spent_by_category(', 'print(status(', 3), highlight: linesFrom(c2, 'def spent_by_category(', 'return totals') }, session: s2,
  side: [
    {
      type: 'group', id: 'buckets', title: 'totals = defaultdict(Decimal)', icon: 'boxes', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'rows', title: 'each expense', rows: [{ id: 'r1', cells: ['Café Lumen 4.50 food'] }, { id: 'r2', cells: ['AMZN MKTP… 15.99 shopping'] }, { id: 'r3', cells: ['Noodle Bar 12.99 food'] }] },
        { type: 'table', id: 'totals', title: 'totals', rows: [{ id: 'food', cells: ['food', '+='] }, { id: 'shopping', cells: ['shopping', 'made on first touch'], tone: 'store' }] },
      ],
    },
    {
      type: 'table', id: 'payees', title: 'Counter(…).most_common(3)', tone: 'store', columns: ['payee', 'times'], rows: [['TFL TRAVEL CH', '3'], ['NETFLIX.COM', '2'], ['THAMES WATER', '2']],
    },
    {
      type: 'table', id: 'rep', title: 'The report: every month together', tone: 'consume', columns: ['category', 'says'], rows: [
        ['transport', 'over budget by 2.40'], ['fun', 'over budget by 47.28'], ['food', 'on track, 156.51 left'],
      ],
    },
    { type: 'item', id: 'cap', title: 'Two counting tools', icon: 'boxes', tone: 'ingest', bullets: ['defaultdict: a missing key gets a start value', 'Counter: counts, most_common(n)'] },
    { type: 'note', id: 'c-note', tone: 'consume', text: "One pass over the expenses, not one per category. But the report now adds September to October, so transport looks over budget: dates come later in this course." },
  ],
  edges: [{ from: 'rows.r1', to: 'totals.food' }, { from: 'rows.r2', to: 'totals.shopping' }],
})

// §3 — sorting, with a key. The bars are 6.3's report (all months): budget − left, sorted.
const CATS3: [string, number][] = [['food', 143.49], ['fun', 107.28], ['transport', 82.4], ['bills', 64.8], ['shopping', 15.99], ['rent', 0]]
const sort3 = ideFrame({
  tree, editor: { file, code: c3, ...view(c3, 'def report(', 'print(date, description, amount, category)', 3), highlight: [lineOf(c3, 'for category in sorted('), lineOf(c3, 'biggest = sorted(')] }, session: s3,
  side: [
    {
      type: 'plot', id: 'bars', compact: true, title: 'Spent by category, sorted (both months)', x: { labels: CATS3.map(([c]) => c) }, y: { min: 0, max: 160, step: 40 },
      series: [{ kind: 'bar', points: CATS3.map(([, v], i) => [i, v]), tone: 'ingest' }],
    },
    {
      type: 'table', id: 'key', title: 'key=lambda e: e[2]', tone: 'store', columns: ['sorted by', 'the key returns'], rows: [
        ['each expense e', 'its amount, e[2]'], ['reverse=True', 'biggest first'],
      ],
    },
    {
      type: 'table', id: 'top', title: 'top: the three biggest', tone: 'ingest', rows: [['Train to Porto 68.40'], ['Concert tickets 64.00'], ['Corner Market 46.20']],
    },
    { type: 'note', id: 's-note', tone: 'ingest', text: 'sorted never changes the list it is given; it returns a new one. A lambda is a one-expression function with no name.' },
  ],
})

// §4 — dates: TODAY, timedelta, a month's prefix. The plot sums October per day from data/expenses.json.
const october = (JSON.parse(d4) as { date: string; amount: string }[]).filter((e) => e.date.startsWith('2026-10'))
const perDay = Array.from({ length: 16 }, (_, i) => {
  const day = `2026-10-${String(i + 1).padStart(2, '0')}`
  return [i + 1, october.filter((e) => e.date === day).reduce((sum, e) => sum + Number(e.amount), 0)] as [number, number]
})
const dates4 = ideFrame({
  tree, editor: { file, code: c4, ...view(c4, 'def spent_by_category(', 'return [e for e in expenses', 3), highlight: linesFrom(c4, 'def recent(', 'return [e for e in expenses') }, session: s4,
  side: [
    {
      type: 'plot', id: 'days', compact: true, title: 'October, spent per day', x: { min: 0, max: 17, step: 2, label: 'day' }, y: { min: 0, max: 80, step: 20 },
      series: [{ kind: 'bar', points: perDay.filter(([, v]) => v > 0), tone: 'ingest' }],
    },
    {
      type: 'table', id: 'repl', title: 'The REPL', tone: 'ingest', columns: ['typed', 'answer'], rows: [
        ['date(2026, 10, 16) - timedelta(days=30)', 'date(2026, 9, 16)'], ['(date(2026, 10, 9) - date(2026, 9, 9)).days', '30'],
      ],
    },
    { type: 'table', id: 'recent', title: 'recent 7', tone: 'store', rows: [['2 expenses, 35.20 in 7 days']] },
    { type: 'note', id: 'd-note', tone: 'store', text: 'report now means this month: dates stored as YYYY-MM-DD sort and slice correctly, so "2026-10" is a prefix.' },
  ],
})

// §5 — recurring bills: same payee, same amount, about a month apart.
const rec5 = ideFrame({
  tree, editor: { file, code: c5, ...view(c5, 'def recurring(', 'yield description', 3), highlight: linesFrom(c5, 'def recurring(', 'yield description') }, session: s5,
  side: [
    {
      type: 'group', id: 'steps', title: 'recurring()', icon: 'clock', tone: 'ingest', children: [
        { type: 'item', id: 'g', title: 'group by (payee, amount)', sub: 'a defaultdict of lists of dates', icon: 'boxes' },
        { type: 'item', id: 'gap', title: 'sort the dates, take the gaps', sub: 'zip(days, days[1:])', icon: 'clock' },
        { type: 'item', id: 'flag', title: 'every gap 25 to 35 days?', sub: 'then yield it', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'found', title: 'Found in Ana\'s data', tone: 'store', columns: ['payee', 'amount', 'dates', 'gap'], rows: [
        ['NETFLIX.COM', '10.99', '09-09, 10-09', '30'], ['THAMES WATER', '32.40', '09-15, 10-15', '30'],
      ],
    },
    {
      type: 'table', id: 'not', title: 'Not recurring', tone: 'ingest', columns: ['payee', 'why'], rows: [['TFL TRAVEL CH', 'different amounts'], ['TESCO STORES 2041', '41.10, then 23.85']],
    },
    { type: 'item', id: 'cap', title: 'New tools here', icon: 'clock', tone: 'store', bullets: ['zip(days, days[1:]): each day and the next', 'all(…): every gap passes'] },
    { type: 'note', id: 'r-note', tone: 'ingest', text: 'yield makes recurring a generator: it hands back one bill at a time. The next section is about exactly that.' },
  ],
  edges: [{ from: 'g', to: 'gap' }, { from: 'gap', to: 'flag' }],
})

// §6 — generators: a frame paused at yield.
const gen6 = ideFrame({
  tree, editor: { file, code: c6, ...view(c6, 'def bank_rows(', 'print(good, "imported")', 3), highlight: linesFrom(c6, 'def bank_rows(', 'yield path.name') }, session: s6,
  side: [
    {
      type: 'group', id: 'paused', title: 'rows = bank_rows(): nothing runs yet', icon: 'layers', tone: 'ingest', children: [
        { type: 'table', id: 'caller', title: 'the caller', rows: [['next(rows)']] },
        { type: 'table', id: 'frame', title: 'bank_rows frame: paused at yield', tone: 'store', rows: [['path', 'bank-2026-09.csv'], ['line', '2, then 3, …'], ['row', 'one dict']] },
      ],
    },
    {
      type: 'table', id: 'repl', title: 'The REPL', tone: 'ingest', columns: ['typed', 'answer'], rows: [
        ['rows', '<generator object bank_rows …>'], ['next(rows)', "('bank-2026-09.csv', 2, {…CAFÉ MÜLLER…})"],
        ['next(rows)[:2]', "('bank-2026-09.csv', 3)"], { id: 'rest', cells: ['sum(1 for _ in rows)', '15: the rest'], tone: 'store' },
      ],
    },
    { type: 'item', id: 'cap', title: 'Why it matters', icon: 'memory', tone: 'store', bullets: ['one row in memory, not a year of them', 'each value made only when asked for'] },
    { type: 'note', id: 'g-note', tone: 'ingest', text: 'A generator can be walked once: after the sum, rows is used up. import_bank walks a fresh one each time.' },
  ],
  edges: [{ from: 'caller', to: 'frame', label: 'resumes', bidirectional: true }],
})

// §7 — formatting: one spec taken apart.
const fmt7 = ideFrame({
  tree, editor: { file, code: c7, ...view(c7, 'def status(', 'print(status(', 3), highlight: linesFrom(c7, 'def status(', 'f"{bar:<10}') }, session: s7,
  side: [
    {
      type: 'group', id: 'spec', title: '{spent:>9.2f}', icon: 'code', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'parts', title: 'the spec', rows: [{ id: 'align', cells: ['>'] }, { id: 'width', cells: ['9'] }, { id: 'prec', cells: ['.2'] }, { id: 'kind', cells: ['f'] }] },
        { type: 'table', id: 'means', title: 'means', rows: [{ id: 'm-align', cells: ['align right'] }, { id: 'm-width', cells: ['in 9 characters'] }, { id: 'm-prec', cells: ['2 decimal places'] }, { id: 'm-kind', cells: ['as a fixed-point number'] }] },
      ],
    },
    {
      type: 'table', id: 'others', title: 'The other specs in status()', tone: 'store', columns: ['spec', 'gives'], rows: [
        ['{category:<10}', 'left-aligned, 10 wide'], ['{bar:<10}', 'the bar, padded to 10'], ['{used:>5.0f}', '160, right-aligned'],
      ],
    },
    {
      type: 'table', id: 'printed', title: 'report, October', tone: 'ingest', columns: ['category', 'spent', 'used'], rows: [
        { id: 'fun', cells: ['fun', '96.29', '160% over'], tone: 'consume' }, ['food', '93.99', '31%'], { id: 'tr', cells: ['transport', '76.80', '96% careful'], tone: 'store' }, ['rent', '0.00', '0%'],
      ],
    },
    { type: 'item', id: 'cap', title: 'A report you can read', icon: 'chart', tone: 'store', bullets: ['columns line up', 'fun: 160% over, at a glance'] },
    { type: 'note', id: 'f-note', tone: 'ingest', text: '0.00 for rent: the f format pads a whole Decimal to two places, so every amount looks like money.' },
  ],
  edges: [
    { from: 'parts.align', to: 'means.m-align' }, { from: 'parts.width', to: 'means.m-width' },
    { from: 'parts.prec', to: 'means.m-prec' }, { from: 'parts.kind', to: 'means.m-kind' },
  ],
})

export const reportScenes: Record<string, SceneModel> = {
  'report-regex': regex1, 'report-counter': counter2, 'report-sorting': sort3, 'report-dates': dates4,
  'report-recurring': rec5, 'report-generators': gen6, 'report-formatting': fmt7,
}
