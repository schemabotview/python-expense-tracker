import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { SIDE_W, ideFrame2 } from '../frame'
import { outputOf } from '../lab'
import { folded, pkgTree } from '../pkgtree'
import r1 from '../../../spine/connect/01-http/project/expense_tracker/rates.py?raw'
import s1 from '../../../spine/connect/01-http/session.txt?raw'
import r2 from '../../../spine/connect/02-asyncio/project/expense_tracker/rates.py?raw'
import s2 from '../../../spine/connect/02-asyncio/session.txt?raw'
import p3 from '../../../spine/connect/03-measure-first/project/bench/profile_import.py?raw'
import s3 from '../../../spine/connect/03-measure-first/session.txt?raw'
import w4 from '../../../spine/connect/04-cpu-or-io/project/bench/where_time_goes.py?raw'
import s4 from '../../../spine/connect/04-cpu-or-io/session.txt?raw'
import s5 from '../../../spine/connect/05-the-gil/session.txt?raw'
import t6 from '../../../spine/connect/06-threads/project/bench/threads.py?raw'
import s6 from '../../../spine/connect/06-threads/session.txt?raw'
import q7 from '../../../spine/connect/07-processes/project/bench/processes.py?raw'
import s7 from '../../../spine/connect/07-processes/session.txt?raw'

// Course 10 — talk to the network, measure it, on IDE frame v2 (each side pane: the section's mental
// model as its title, one diagram or plot, at most one table). Timings are VOLATILE (spine.py masks their digits),
// so every number shown here is parsed out of the step's session, never typed.
const MODS = ['__init__.py', '__main__.py', 'bank.py', 'categorise.py', 'cli.py', 'errors.py', 'models.py', 'money.py', 'rates.py', 'report.py', 'store.py', 'timing.py']
const TESTS = ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_cli.py', 'test_money.py']
const stub = (fresh = false): TreeEntry => ({ name: 'stub', state: fresh ? 'new' : undefined, children: [{ name: 'rates_server.py' }] })
const bench = (files: string[], active: string, fresh: string[] = []): TreeEntry => ({
  name: 'bench', children: files.map((f): TreeEntry => ({ name: f, state: f === active ? 'active' : fresh.includes(f) ? 'new' : undefined })),
})
const extra = (b?: TreeEntry): TreeEntry[] => [...(b ? [b] : []), { name: 'pyproject.toml' }, stub()]
// A plot in the side pane: compact, and as wide as the pane's content.
const PLOT_W = SIDE_W - 34
const all = (text: string, re: RegExp) => [...text.matchAll(re)]

// §1 — HTTP: one rate from the (local, stub) rate service.
const http1 = ideFrame2({
  model: 'A request out, a JSON reply back', tree: folded(pkgTree([...MODS], 'rates.py', ['rates.py'], [{ name: 'pyproject.toml' }, stub(true)], TESTS)),
  editor: { file: 'expense_tracker/rates.py', code: r1, highlight: [lineOf(r1, 'urllib.request.urlopen'), lineOf(r1, 'data = json.load'), lineOf(r1, 'return Decimal(data["rate"])')],
    // the request, the JSON reply, the rate: the diagram's three steps
    show: [[lineOf(r1, 'urllib.request.urlopen'), lineOf(r1, 'data = json.load')], [lineOf(r1, 'return Decimal(data["rate"])'), lineOf(r1, 'return Decimal(data["rate"])')]] }, session: s1,
  side: [
    {
      type: 'group', id: 'trip', title: 'rate("EUR")', icon: 'globe', tone: 'ingest', children: [
        { type: 'item', id: 'req', title: 'GET /rates/EUR', sub: 'urllib.request.urlopen', icon: 'terminal' },
        { type: 'item', id: 'svc', title: 'the rate service', sub: 'stub/rates_server.py: answers in 0.2 s', icon: 'server' },
        { type: 'item', id: 'json', title: 'JSON back', sub: '{"from": "EUR", "to": "GBP", "rate": "0.86"}', icon: 'file', tone: 'store' },
      ],
    },
    { type: 'table', id: 'conv', title: 'to_gbp: the euro row, in pounds', tone: 'store', columns: ['in', 'at', 'out'], rows: [['48.00 EUR', '× 0.86', '41.28 GBP']] },
  ],
  edges: [{ from: 'req', to: 'svc', label: 'request' }, { from: 'svc', to: 'json', label: 'response' }],
})

// §2 — asyncio: five waits that overlap.
const [one, atOnce] = all(s2, /5 rates in ([\d.]+) s/g).map((m) => m[1])
const async2 = ideFrame2({
  model: 'One loop, five waits at once', tree: folded(pkgTree([...MODS], 'rates.py', [], extra(), TESTS)),
  editor: { file: 'expense_tracker/rates.py', code: r2, highlight: linesFrom(r2, 'async def rates_at_once(', 'return await asyncio.gather') }, session: s2,
  side: [
    {
      type: 'group', id: 'loop', title: 'asyncio.run(rates_at_once(…))', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'event', title: 'the event loop', sub: 'starts all five, then waits for the last', icon: 'clock' },
        { type: 'table', id: 'tasks', title: 'five tasks, each awaiting its reply', rows: [['EUR', 'USD', 'CHF', 'JPY', 'SEK']] },
      ],
    },
    {
      type: 'table', id: 'times', title: 'Five rates, this run', tone: 'store', columns: ['fetched', 'took'], rows: [
        ['one by one', `${one} s`], { id: 'at', cells: ['at once', `${atOnce} s`], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'event', to: 'tasks', label: 'gather' }],
})

// §3 — measure first: cProfile, own time by function.
const prof = all(outputOf(s3, 'python -m bench.profile_import'), /^ {2}(\S+)\s+(\d+)%$/gm).map((m) => [m[1], Number(m[2])] as [string, number])
const total3 = outputOf(s3, 'python -m bench.profile_import').split('\n')[0].split('. ')[0]
// Six bars in a 400px plot: function names shortened so the labels do not touch.
const LABEL: Record<string, string> = { validate: 'valid.', categorise: 'categ.', parse_amount: 'parse', __post_init__: 'post' }
const measure3 = ideFrame2({
  model: 'Measure first: where the time really goes', tree: folded(pkgTree([...MODS], '', [], extra(bench(['__init__.py', 'profile_import.py', 'year.py'], 'profile_import.py', ['__init__.py', 'profile_import.py', 'year.py'])), TESTS)),
  editor: { file: 'bench/profile_import.py', code: p3, highlight: linesFrom(p3, 'profile = cProfile.Profile()', 'profile.disable()') }, session: s3,
  side: [
    {
      type: 'plot', id: 'own', compact: true, w: PLOT_W, title: 'Own time, % (CPython 3.15.1)', x: { labels: prof.map(([n]) => LABEL[n] ?? n) }, y: { min: 0, max: 40, step: 10 },
      series: [{ kind: 'bar', points: prof.map(([, v], i) => [i, v]), tone: 'ingest' }],
    },
    { type: 'table', id: 'total', title: 'The whole run', tone: 'store', rows: [[total3]] },
  ],
})

// §4 — CPU-bound or I/O-bound: wall time against CPU time.
const rows4 = all(outputOf(s4, 'python -m bench.where_time_goes'), /wall\s+([\d.]+) s\s+CPU\s+([\d.]+) s/g).map((m) => [Number(m[1]), Number(m[2])])
const cpuio4 = ideFrame2({
  model: 'Wall time against CPU time', tree: folded(pkgTree([...MODS], '', [], extra(bench(['__init__.py', 'profile_import.py', 'where_time_goes.py', 'year.py'], 'where_time_goes.py', ['where_time_goes.py'])), TESTS)),
  editor: { file: 'bench/where_time_goes.py', code: w4, highlight: linesFrom(w4, 'def measure(', 'print(f"{label') }, session: s4,
  side: [
    {
      type: 'plot', id: 'bars', compact: true, w: PLOT_W, title: 'Seconds: wall, then CPU', x: { labels: ['5 rates', 'categorise'] }, y: { min: 0, max: 1.2, step: 0.3 },
      series: [
        { kind: 'bar', points: [[0, rows4[0][0]], [1, rows4[1][0]]], label: 'wall', tone: 'ingest' },
        { kind: 'bar', points: [[0, rows4[0][1]], [1, rows4[1][1]]], label: 'CPU', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'pick', title: 'The question that picks the tool', tone: 'ingest', columns: ['mostly', 'it is', 'reach for'], rows: [
        ['waiting', 'I/O-bound', 'asyncio, threads'], ['computing', 'CPU-bound', 'processes, 3.15t'],
      ],
    },
  ],
})

// §5 — ◆ full scene: the GIL and free-threading.
const lab5 = s5.trim()
const gil5: SceneModel = {
  title: 'The GIL, and the free-threaded build',
  sub: 'CPython 3.15.1: two builds of the same Python, on this 4-core machine',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'gil', title: 'python3.15: the GIL is on', sub: 'one thread runs Python at a time', icon: 'lock', tone: 'consume', children: [
        { type: 'table', id: 'g-threads', title: 'four threads', rows: [['thread 1'], ['thread 2'], ['thread 3'], ['thread 4']] },
        { type: 'item', id: 'g-lock', title: 'the GIL', sub: 'held by one thread; the rest wait', icon: 'lock', tone: 'consume' },
        { type: 'table', id: 'g-cores', title: 'cores busy with Python', rows: [['1 of 4']] },
      ],
    },
    {
      type: 'group', id: 'ft', title: 'python3.15t: free-threaded', sub: 'threads run Python in parallel', icon: 'cpu', tone: 'store', children: [
        { type: 'table', id: 'f-threads', title: 'four threads', rows: [['thread 1'], ['thread 2'], ['thread 3'], ['thread 4']] },
        { type: 'item', id: 'f-locks', title: 'no global lock', sub: 'objects lock themselves, briefly, when shared', icon: 'lock', tone: 'store' },
        { type: 'table', id: 'f-cores', title: 'cores busy with Python', rows: [['up to 4 of 4']] },
      ],
    },
    {
      type: 'group', id: 'facts', title: 'Asked of each build', icon: 'terminal', tone: 'ingest', children: [
        { type: 'code', id: 'lab', terminal: true, filename: 'terminal', code: lab5 },
        {
          type: 'table', id: 'costs', title: 'What each costs', columns: ['', 'GIL on', 'free-threaded'], rows: [
            ['one thread', 'the usual speed', 'a little slower'], ['many threads, CPU work', 'no faster', 'faster'], ['available', 'always', '3.13 experimental, 3.14 supported'],
          ],
        },
      ],
    },
  ],
  edges: [
    { from: 'g-threads', to: 'g-lock' }, { from: 'g-lock', to: 'g-cores' },
    { from: 'f-threads', to: 'f-locks' }, { from: 'f-locks', to: 'f-cores' },
  ],
}

// §6 — threads, measured on both builds. Bars: the first run of each build.
const t = all(s6, /GIL (on |off): 1 thread ([\d.]+) s, 4 threads ([\d.]+) s, ([\d.]+)x/g).map((m) => ({ gil: m[1].trim(), one: Number(m[2]), four: Number(m[3]), x: m[4] }))
const threads6 = ideFrame2({
  model: 'Free-threading: threads run in parallel', tree: folded(pkgTree([...MODS], '', [], extra(bench(['__init__.py', 'profile_import.py', 'threads.py', 'where_time_goes.py', 'year.py'], 'threads.py', ['threads.py'])), TESTS)),
  editor: { file: 'bench/threads.py', code: t6, highlight: linesFrom(t6, 'def seconds(', 'return time.perf_counter() - start') }, session: s6,
  side: [
    {
      type: 'plot', id: 'bars', compact: true, w: PLOT_W, title: 'Seconds, run 1: 1 thread, then 4', x: { labels: ['GIL on', 'free-threaded'] }, y: { min: 0, max: 1.4, step: 0.35 },
      series: [
        { kind: 'bar', points: [[0, t[0].one], [1, t[1].one]], label: '1', tone: 'ingest' },
        { kind: 'bar', points: [[0, t[0].four], [1, t[1].four]], label: '4', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'runs', title: 'Speed-up from 4 threads', tone: 'ingest', columns: ['build', 'run 1', 'run 2'], rows: [
        ['GIL on', `${t[0].x}x`, `${t[2].x}x`], { id: 'ft', cells: ['free-threaded', `${t[1].x}x`, `${t[3].x}x`], tone: 'store' },
      ],
    },
  ],
})

// §7 — processes: a pool of workers.
const procs7 = ideFrame2({
  model: 'A pool of processes, a GIL each', tree: folded(pkgTree([...MODS], '', [], extra(bench(['__init__.py', 'processes.py', 'profile_import.py', 'threads.py', 'where_time_goes.py', 'year.py'], 'processes.py', ['processes.py'])), TESTS)),
  editor: { file: 'bench/processes.py', code: q7, highlight: linesFrom(q7, 'with ProcessPoolExecutor(processes) as pool:', 'list(pool.map(work, chunks))') }, session: s7,
  side: [
    {
      type: 'group', id: 'pool', title: 'ProcessPoolExecutor(4)', icon: 'boxes', tone: 'ingest', children: [
        { type: 'item', id: 'main', title: 'this process', sub: 'splits the work, pickles each chunk', icon: 'python' },
        { type: 'table', id: 'workers', title: 'four processes, a Python each', tone: 'store', rows: [['worker 1', 'its own GIL'], ['worker 2', 'its own GIL'], ['worker 3', 'its own GIL'], ['worker 4', 'its own GIL']] },
      ],
    },
    {
      type: 'table', id: 'choose', title: 'Processes or threads?', tone: 'ingest', columns: ['', 'processes', 'threads'], rows: [
        ['memory', 'copied', 'shared'], ['the GIL', 'one each', 'one; none in 3.15t'], ['start-up', 'slow', 'fast'],
      ],
    },
  ],
  edges: [{ from: 'main', to: 'workers', label: 'map' }],
})

export const connectScenes: Record<string, SceneModel> = {
  'connect-http': http1, 'connect-asyncio': async2, 'connect-measure-first': measure3, 'connect-cpu-or-io': cpuio4,
  'connect-the-gil': gil5, 'connect-threads': threads6, 'connect-processes': procs7,
}
