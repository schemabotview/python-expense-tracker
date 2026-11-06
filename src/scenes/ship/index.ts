import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { appMap } from '../map'
import { folded, pkgTree } from '../pkgtree'
import c1 from '../../../spine/ship/01-configuration/project/expense_tracker/config.py?raw'
import s1 from '../../../spine/ship/01-configuration/session.txt?raw'
import p2 from '../../../spine/ship/02-packaging/project/pyproject.toml?raw'
import s2 from '../../../spine/ship/02-packaging/session.txt?raw'
import a3 from '../../../spine/ship/03-web-api/project/expense_tracker/api.py?raw'
import s3 from '../../../spine/ship/03-web-api/session.txt?raw'
import s4 from '../../../spine/ship/04-the-finished-app/session.txt?raw'

// Course 11 — ship it, on IDE frame v2 (each side pane: the section's mental model as its title,
// one diagram, at most one table). Values are the sessions' output.
const MODS = ['__init__.py', '__main__.py', 'bank.py', 'categorise.py', 'cli.py', 'config.py', 'errors.py', 'models.py', 'money.py', 'rates.py', 'report.py', 'store.py', 'timing.py']
const TESTS = ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_cli.py', 'test_config.py', 'test_money.py']
const around = (active?: string, fresh: string[] = []): TreeEntry[] => [
  { name: 'bench', folder: true }, { name: 'stub', folder: true },
  { name: 'expense-tracker.toml', state: active === 'expense-tracker.toml' ? 'active' : fresh.includes('expense-tracker.toml') ? 'new' : undefined },
  { name: 'pyproject.toml', state: active === 'pyproject.toml' ? 'active' : undefined },
]

// §1 — configuration: four layers, each overriding the last.
const LAYERS = ['found[name] = (value, str(FILE))', 'found[name] = (value, PREFIX', 'found[name] = (flag, f"--{name}")']
const config1 = ideFrame2({
  model: 'Four layers: the last to speak wins',
  tree: folded(pkgTree(MODS, 'config.py', ['config.py'], around(undefined, ['expense-tracker.toml']), TESTS)),
  editor: { file: 'expense_tracker/config.py', code: c1, highlight: LAYERS.map((t) => lineOf(c1, t)),
    // the three layers over the defaults, one line each (the defaults line wraps: it does not fit)
    show: LAYERS.map((t): [number, number] => [lineOf(c1, t), lineOf(c1, t)]) }, session: s1,
  side: [
    { type: 'item', id: 'd', title: 'built-in defaults', sub: 'store json, data data', icon: 'python', tone: 'neutral' },
    { type: 'item', id: 'f', title: 'expense-tracker.toml', sub: 'tomllib, the standard library', icon: 'file', tone: 'ingest' },
    { type: 'item', id: 'e', title: 'EXPENSE_TRACKER_STORE=…', sub: 'the environment', icon: 'settings', tone: 'ingest' },
    { type: 'item', id: 'g', title: '--store …', sub: 'a flag on this one run', icon: 'terminal', tone: 'store' },
    {
      type: 'table', id: 'ran', title: 'config, three ways', tone: 'ingest', columns: ['run with', 'store', 'from'], rows: [
        ['nothing extra', 'json', 'the .toml'], ['…_STORE=sqlite', 'sqlite', 'the environment'], { id: 'flag', cells: ['… --store json', 'json', '--store'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'd', to: 'f', label: 'overridden by' }, { from: 'f', to: 'e' }, { from: 'e', to: 'g' }],
})

// §2 — packaging: pyproject → a wheel → a command in a fresh venv.
const pack2 = ideFrame2({
  model: 'A folder → a wheel → a command',
  tree: folded([...pkgTree(MODS, '', [], around('pyproject.toml'), TESTS), { name: 'dist', state: 'new', folder: true }]),
  editor: { file: 'pyproject.toml', code: p2, lang: 'text', highlight: [lineOf(p2, '[build-system]'), lineOf(p2, 'build-backend'), lineOf(p2, 'expense-tracker = '), lineOf(p2, 'packages = ')],
    show: [[lineOf(p2, '[build-system]'), lineOf(p2, 'build-backend')], [lineOf(p2, 'expense-tracker = '), lineOf(p2, 'expense-tracker = ')], [lineOf(p2, 'packages = '), lineOf(p2, 'packages = ')]] }, session: s2,
  side: [
    {
      type: 'group', id: 'flow', title: 'From a folder to a command', icon: 'package', tone: 'ingest', children: [
        { type: 'item', id: 'py', title: 'pyproject.toml', sub: 'name, version 1.0.0, the script', icon: 'file' },
        { type: 'item', id: 'whl', title: 'a wheel: a zip of the package', sub: 'expense_tracker-1.0.0-py3-none-any.whl', icon: 'package' },
        { type: 'item', id: 'cmd', title: '~/fresh/bin/expense-tracker', sub: 'installed in a brand-new venv', icon: 'terminal', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'name', title: 'The wheel\'s name says', tone: 'ingest', columns: ['part', 'means'], rows: [['1.0.0', 'the version'], ['py3', 'any Python 3'], ['none-any', 'no C code: any platform']],
    },
  ],
  edges: [{ from: 'py', to: 'whl', label: 'pip wheel' }, { from: 'whl', to: 'cmd', label: 'pip install' }],
})

// §3 — a web API: request → handler → store → JSON.
// do_POST's own lines (do_GET opens a JsonStore first).
const POST = lineOf(a3, 'def do_POST(')
const api3 = ideFrame2({
  model: 'Request → handler → store → JSON',
  tree: folded(pkgTree([...MODS, 'api.py'].sort(), 'api.py', ['api.py'], around(), TESTS)),
  editor: { file: 'expense_tracker/api.py', code: a3, highlight: [lineOf(a3, 'amount = Money(parse_amount'), lineOf(a3, 'category = Category.parse'), lineOf(a3, 'with JsonStore(', POST), lineOf(a3, 'store.save(expenses)', POST), lineOf(a3, 'self.reply(201')],
    // handler, store, reply: the diagram's middle steps
    show: [[lineOf(a3, 'amount = Money(parse_amount'), lineOf(a3, 'category = Category.parse')], [lineOf(a3, 'with JsonStore(', POST), lineOf(a3, 'with JsonStore(', POST)], [lineOf(a3, 'store.save(expenses)', POST), lineOf(a3, 'self.reply(201')]] }, session: s3,
  side: [
    {
      type: 'group', id: 'flow', title: 'POST /expenses', icon: 'globe', tone: 'ingest', children: [
        { type: 'item', id: 'req', title: 'curl -X POST … -d \'{…}\'', sub: 'a JSON body', icon: 'terminal' },
        { type: 'item', id: 'h', title: 'Api.do_POST', sub: 'parse_amount, Category.parse', icon: 'code' },
        { type: 'item', id: 'st', title: 'JsonStore', sub: 'load, append, save', icon: 'database' },
        { type: 'item', id: 'res', title: '201 Created', sub: '{"added": "3.20 GBP", "to": "food"}', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'ran', title: 'This session', tone: 'ingest', columns: ['request', 'status'], rows: [
        ['GET /report?month=2026-09', '200'], { id: 'ok', cells: ['POST 3.20 food bakery', '201'], tone: 'store' },
        { id: 'bad', cells: ['POST 12,50', '400'], tone: 'consume' }, ['GET /budgets', '404'],
      ],
    },
  ],
  edges: [{ from: 'req', to: 'h' }, { from: 'h', to: 'st' }, { from: 'st', to: 'res' }],
})

// §4 — the finished app: the map, everything lit, and the final checks.
const finished4: SceneModel = appMap({
  title: 'The finished app',
  sub: 'expense-tracker 1.0.0: typed, tested, configured, packaged, and on the web',
  built: 11,
  output: { type: 'code', id: 'out-final', terminal: true, filename: 'terminal: the final checks', code: s4.trim().replace(/\t/g, '  ') },
})

// §5 — where next: each part of the app, and the tool that does that job at scale.
const NEXT: [string, string, string][] = [
  ['cli', 'argparse', 'Typer, Click'],
  ['api', 'http.server', 'FastAPI, Django'],
  ['store', 'JSON, sqlite3', 'PostgreSQL, SQLAlchemy'],
  ['rows', 'csv, loops over rows', 'pandas, Polars'],
  ['scale', 'one machine, one year', 'PySpark, Databricks'],
  ['ship', 'pip, venv, pyproject', 'uv, PyPI'],
]
const next5: SceneModel = {
  title: 'Where next',
  sub: 'Every part of expense-tracker, and the tool that does the same job at a bigger scale',
  dir: 'row',
  nodes: [
    { type: 'table', id: 'ours', title: 'In this course: the standard library', tone: 'ingest', columns: ['part', 'built with'], rows: NEXT.map(([id, part]) => ({ id, cells: [id, part] })) },
    { type: 'table', id: 'theirs', title: 'Next: the tool for the job at scale', tone: 'store', columns: ['tool'], rows: NEXT.map(([id, , tool]) => ({ id: `t-${id}`, cells: [tool], tone: id === 'scale' ? 'store' : undefined })) },
  ],
  edges: NEXT.map(([id]) => ({ from: `ours.${id}`, to: `theirs.t-${id}` })),
}

export const shipScenes: Record<string, SceneModel> = {
  'ship-configuration': config1, 'ship-packaging': pack2, 'ship-web-api': api3, 'ship-the-finished-app': finished4, 'ship-where-next': next5,
}
