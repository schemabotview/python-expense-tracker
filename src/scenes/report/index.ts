import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { SIDE_W, ideFrame2 } from '../frame'

// A plot in the side pane: compact, and as wide as the pane's content.
const PLOT_W = SIDE_W - 34
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

// Course 6 — categorise and report, on IDE frame v2 (each side pane: the section's mental model as
// its title, one diagram, at most one table). Values are the sessions' output, or computed from the step's
// own data/expenses.json (the per-day plot), never typed.
const file = 'main.py'
const tree: TreeEntry[] = [
  { name: '.venv', folder: true, state: 'muted' },
  { name: 'data', children: [{ name: 'bank', folder: true }, { name: 'expenses.json' }] },
  { name: 'main.py', state: 'active' },
]

// §1 — regular expressions: a bank's description → a category.
const regex1 = ideFrame2({
  model: 'The first pattern that matches names it', tree, editor: { file, code: c1, highlight: linesFrom(c1, '(re.compile(r"TESCO', '"bills"),') }, session: s1,
  side: [
    {
      type: 'group', id: 'map', title: 'categorise(description)', icon: 'filter', tone: 'ingest', dir: 'row', children: [
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
  ],
  edges: [
    { from: 'descs.amzn', to: 'cats.shopping' }, { from: 'descs.tfl', to: 'cats.transport' }, { from: 'descs.nflx', to: 'cats.fun' },
    { from: 'descs.water', to: 'cats.bills' }, { from: 'descs.cafe', to: 'cats.food' },
  ],
})

// §2 — grouping with defaultdict, counting with Counter.
const counter2 = ideFrame2({
  model: 'One pass drops each expense in its bucket', tree, editor: { file, code: c2, highlight: linesFrom(c2, 'def spent_by_category(', 'return totals') }, session: s2,
  side: [
    {
      type: 'group', id: 'buckets', title: 'totals = defaultdict(Decimal)', icon: 'boxes', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'rows', title: 'each expense', rows: [{ id: 'r1', cells: ['4.50 food'] }, { id: 'r2', cells: ['15.99 shopping'] }, { id: 'r3', cells: ['12.99 food'] }] },
        { type: 'table', id: 'totals', title: 'totals', rows: [{ id: 'food', cells: ['food', '+='] }, { id: 'shopping', cells: ['shopping', 'new'], tone: 'store' }] },
      ],
    },
    {
      type: 'table', id: 'payees', title: 'Counter(…).most_common(3)', tone: 'store', columns: ['payee', 'times'], rows: [['TFL TRAVEL CH', '3'], ['NETFLIX.COM', '2'], ['THAMES WATER', '2']],
    },
  ],
  edges: [{ from: 'rows.r1', to: 'totals.food' }, { from: 'rows.r2', to: 'totals.shopping' }],
})

// §3 — sorting, with a key. The bars are 6.3's report (all months): budget − left, sorted.
const CATS3: [string, number][] = [['food', 143.49], ['fun', 107.28], ['transport', 82.4], ['bills', 64.8], ['shopping', 15.99], ['rent', 0]]
// Six bars in a 400px plot: the two long names are shortened so the labels do not touch.
const SHORT: Record<string, string> = { transport: 'transp.', shopping: 'shop.' }
const sort3 = ideFrame2({
  model: 'sorted returns a new list, in key order', tree, editor: { file, code: c3, highlight: [lineOf(c3, 'for category in sorted('), lineOf(c3, 'biggest = sorted(')],
    show: [[lineOf(c3, 'def report('), lineOf(c3, 'for category in sorted(')], [lineOf(c3, 'biggest = sorted('), lineOf(c3, 'biggest = sorted(')]] }, session: s3,
  side: [
    {
      type: 'plot', id: 'bars', compact: true, w: PLOT_W, title: 'Spent by category, sorted (both months)', x: { labels: CATS3.map(([c]) => SHORT[c] ?? c) }, y: { min: 0, max: 160, step: 40 },
      series: [{ kind: 'bar', points: CATS3.map(([, v], i) => [i, v]), tone: 'ingest' }],
    },
    {
      type: 'table', id: 'key', title: 'key=lambda e: e[2]', tone: 'store', columns: ['sorted by', 'the key returns'], rows: [
        ['each expense e', 'its amount, e[2]'], ['reverse=True', 'biggest first'],
      ],
    },
  ],
})

// §4 — dates: TODAY, timedelta, a month's prefix. The plot sums October per day from data/expenses.json.
const october = (JSON.parse(d4) as { date: string; amount: string }[]).filter((e) => e.date.startsWith('2026-10'))
const perDay = Array.from({ length: 16 }, (_, i) => {
  const day = `2026-10-${String(i + 1).padStart(2, '0')}`
  return [i + 1, october.filter((e) => e.date === day).reduce((sum, e) => sum + Number(e.amount), 0)] as [number, number]
})
const dates4 = ideFrame2({
  model: 'A date is a value you can subtract', tree, editor: { file, code: c4, highlight: linesFrom(c4, 'def recent(', 'return [e for e in expenses') }, session: s4,
  side: [
    {
      type: 'plot', id: 'days', compact: true, w: PLOT_W, title: 'October, spent per day', x: { min: 0, max: 17, step: 2, label: 'day' }, y: { min: 0, max: 80, step: 20 },
      series: [{ kind: 'bar', points: perDay.filter(([, v]) => v > 0), tone: 'ingest' }],
    },
    { type: 'table', id: 'recent', title: 'recent 7', tone: 'store', rows: [['2 expenses, 35.20 in 7 days']] },
  ],
})

// §5 — recurring bills: same payee, same amount, about a month apart.
const rec5 = ideFrame2({
  model: 'Same payee, same amount, a month apart', tree, editor: { file, code: c5, highlight: linesFrom(c5, 'def recurring(', 'yield description') }, session: s5,
  side: [
    {
      type: 'group', id: 'steps', title: 'recurring()', icon: 'clock', tone: 'ingest', children: [
        { type: 'item', id: 'g', title: 'group by (payee, amount)', sub: 'a defaultdict of lists of dates', icon: 'boxes' },
        { type: 'item', id: 'gap', title: 'sort the dates, take the gaps', sub: 'zip(days, days[1:])', icon: 'clock' },
        { type: 'item', id: 'flag', title: 'every gap 25 to 35 days?', sub: 'then yield it', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'not', title: 'Not recurring', tone: 'ingest', columns: ['payee', 'why'], rows: [['TFL TRAVEL CH', 'different amounts'], ['TESCO STORES 2041', '41.10, then 23.85']],
    },
  ],
  edges: [{ from: 'g', to: 'gap' }, { from: 'gap', to: 'flag' }],
})

// §6 — generators: a frame paused at yield.
const gen6 = ideFrame2({
  model: 'A generator is a frame paused at yield', tree, editor: { file, code: c6, highlight: [lineOf(c6, 'for line, row in enumerate('), lineOf(c6, 'yield path.name')] }, session: s6,
  side: [
    { type: 'item', id: 'caller', icon: 'code', tone: 'neutral', title: 'next(rows)', sub: 'the caller asks for one value' },
    { type: 'table', id: 'frame', title: 'bank_rows frame: paused at yield', tone: 'store', rows: [['path', 'bank-2026-09.csv'], ['line', '2, then 3, …'], ['row', 'one dict']] },
    { type: 'item', id: 'value', icon: 'check', tone: 'store', title: '(path.name, line, row)', sub: 'one row back; the frame waits' },
  ],
  edges: [{ from: 'caller', to: 'frame', label: 'resumes' }, { from: 'frame', to: 'value', label: 'yields' }],
})

// §7 — formatting: one spec taken apart.
const fmt7 = ideFrame2({
  model: 'A spec: align, width, precision, type', tree, editor: { file, code: c7, highlight: linesFrom(c7, 'def status(', 'f"{bar:<10}') }, session: s7,
  side: [
    {
      type: 'group', id: 'spec', title: '{spent:>9.2f}', icon: 'code', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'parts', title: 'the spec', rows: [{ id: 'align', cells: ['>'] }, { id: 'width', cells: ['9'] }, { id: 'prec', cells: ['.2'] }, { id: 'kind', cells: ['f'] }] },
        { type: 'table', id: 'means', title: 'means', rows: [{ id: 'm-align', cells: ['align right'] }, { id: 'm-width', cells: ['in 9 characters'] }, { id: 'm-prec', cells: ['2 decimal places'] }, { id: 'm-kind', cells: ['as a fixed-point number'] }] },
      ],
    },
    {
      type: 'table', id: 'printed', title: 'report, October', tone: 'ingest', columns: ['category', 'spent', 'used'], rows: [
        { id: 'fun', cells: ['fun', '96.29', '160% over'], tone: 'consume' }, ['food', '93.99', '31%'], { id: 'tr', cells: ['transport', '76.80', '96% careful'], tone: 'store' }, ['rent', '0.00', '0%'],
      ],
    },
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
