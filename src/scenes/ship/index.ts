import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { appMap } from '../map'
import { pkgTree } from '../pkgtree'
import c1 from '../../../spine/ship/01-configuration/project/expense_tracker/config.py?raw'
import s1 from '../../../spine/ship/01-configuration/session.txt?raw'
import p2 from '../../../spine/ship/02-packaging/project/pyproject.toml?raw'
import s2 from '../../../spine/ship/02-packaging/session.txt?raw'
import a3 from '../../../spine/ship/03-web-api/project/expense_tracker/api.py?raw'
import s3 from '../../../spine/ship/03-web-api/session.txt?raw'
import s4 from '../../../spine/ship/04-the-finished-app/session.txt?raw'

// Course 11 — ship it. Values are the sessions' output.
const MODS = ['__init__.py', '__main__.py', 'bank.py', 'categorise.py', 'cli.py', 'config.py', 'errors.py', 'models.py', 'money.py', 'rates.py', 'report.py', 'store.py', 'timing.py']
const TESTS = ['__init__.py', 'test_bank.py', 'test_categorise.py', 'test_cli.py', 'test_config.py', 'test_money.py']
const around = (active?: string, fresh: string[] = []): TreeEntry[] => [
  { name: 'bench', folder: true }, { name: 'stub', folder: true },
  { name: 'expense-tracker.toml', state: active === 'expense-tracker.toml' ? 'active' : fresh.includes('expense-tracker.toml') ? 'new' : undefined },
  { name: 'pyproject.toml', state: active === 'pyproject.toml' ? 'active' : undefined },
]

// §1 — configuration: four layers, each overriding the last.
const config1 = ideFrame({
  tree: pkgTree(MODS, 'config.py', ['config.py'], around(undefined, ['expense-tracker.toml']), TESTS),
  editor: { file: 'expense_tracker/config.py', code: c1, ...view(c1, 'def settings(', undefined, 0), highlight: linesFrom(c1, 'def settings(', 'return found') }, session: s1,
  side: [
    {
      type: 'group', id: 'layers', title: 'Who wins: the last one that says something', icon: 'layers', tone: 'ingest', children: [
        { type: 'item', id: 'd', title: 'built-in defaults', sub: 'store json, data data', icon: 'python' },
        { type: 'item', id: 'f', title: 'expense-tracker.toml', sub: 'tomllib, the standard library', icon: 'file' },
        { type: 'item', id: 'e', title: 'EXPENSE_TRACKER_STORE=…', sub: 'the environment', icon: 'settings' },
        { type: 'item', id: 'g', title: '--store …', sub: 'a flag on this one run', icon: 'terminal', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'ran', title: 'config, three ways', tone: 'ingest', columns: ['run with', 'store', 'from'], rows: [
        ['nothing extra', 'json', 'expense-tracker.toml'], ['EXPENSE_TRACKER_STORE=sqlite', 'sqlite', 'the environment'], { id: 'flag', cells: ['… and --store json', 'json', '--store'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'c-note', tone: 'consume', text: 'A secret, such as an API key, goes in the environment, never in a file that ends up in git.' },
  ],
  edges: [{ from: 'd', to: 'f', label: 'overridden by' }, { from: 'f', to: 'e', label: 'overridden by' }, { from: 'e', to: 'g', label: 'overridden by' }],
})

// §2 — packaging: pyproject → a wheel → a command in a fresh venv.
const pack2 = ideFrame({
  tree: [...pkgTree(MODS, '', [], around('pyproject.toml'), TESTS), { name: 'dist', state: 'new', folder: true, note: 'the wheel' }],
  editor: { file: 'pyproject.toml', code: p2, lang: 'text', highlight: [...linesFrom(p2, '[build-system]', 'build-backend'), ...linesFrom(p2, '[project.scripts]', 'expense-tracker = '), ...linesFrom(p2, '[tool.setuptools]', 'packages = ')] }, session: s2,
  side: [
    {
      type: 'group', id: 'flow', title: 'From a folder to a command', icon: 'package', tone: 'ingest', children: [
        { type: 'item', id: 'py', title: 'pyproject.toml', sub: 'name, version 1.0.0, the script', icon: 'file' },
        { type: 'item', id: 'whl', title: 'expense_tracker-1.0.0-py3-none-any.whl', sub: 'pip wheel: a zip of the package', icon: 'package' },
        { type: 'item', id: 'cmd', title: '~/fresh/bin/expense-tracker', sub: 'installed in a brand-new venv', icon: 'terminal', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'name', title: 'The wheel\'s name says', tone: 'ingest', columns: ['part', 'means'], rows: [['1.0.0', 'the version'], ['py3', 'any Python 3'], ['none-any', 'no C code: any platform']],
    },
    { type: 'item', id: 'cap', title: 'pyproject.toml now holds', icon: 'file', tone: 'ingest', bullets: ['how to build it: setuptools', 'the command: expense-tracker', 'what to ship: expense_tracker only'] },
    { type: 'note', id: 'p-note', tone: 'store', text: 'The fresh venv had no project folder on its path: the report ran from the installed package. That is what installing means.' },
  ],
  edges: [{ from: 'py', to: 'whl', label: 'pip wheel' }, { from: 'whl', to: 'cmd', label: 'pip install' }],
})

// §3 — a web API: request → handler → store → JSON.
const api3 = ideFrame({
  tree: pkgTree([...MODS, 'api.py'].sort(), 'api.py', ['api.py'], around(), TESTS),
  editor: { file: 'expense_tracker/api.py', code: a3, ...view(a3, 'def do_POST(', undefined, 0), highlight: linesFrom(a3, 'def do_POST(', 'self.reply(201') }, session: s3,
  side: [
    {
      type: 'group', id: 'flow', title: 'POST /expenses', icon: 'globe', tone: 'ingest', children: [
        { type: 'item', id: 'req', title: 'curl -X POST … -d \'{…}\'', sub: 'a JSON body', icon: 'terminal' },
        { type: 'item', id: 'h', title: 'Api.do_POST', sub: 'parse_amount, Category.parse', icon: 'code' },
        { type: 'item', id: 'st', title: 'JsonStore', sub: 'load, append, save', icon: 'database' },
        { type: 'item', id: 'res', title: '201 {"added": "3.20 GBP", "to": "food"}', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'ran', title: 'This session', tone: 'ingest', columns: ['request', 'status'], rows: [
        ['GET /report?month=2026-09', '200: spent by category'], { id: 'ok', cells: ['POST 3.20 food bakery', '201: added'], tone: 'store' },
        { id: 'bad', cells: ['POST 12,50', "400: not a number: '12,50'"], tone: 'consume' }, ['GET /budgets', '404: no such page'],
      ],
    },
    { type: 'item', id: 'cap', title: 'Status codes', icon: 'globe', tone: 'store', bullets: ['2xx: it worked (201: created)', '4xx: the request was wrong'] },
    { type: 'note', id: 'a-note', tone: 'ingest', text: 'The same Money, Category and JsonStore the command line uses: the API is one more way in, not a second app.' },
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
