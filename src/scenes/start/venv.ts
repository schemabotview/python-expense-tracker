import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { venvOpen } from './tree'
import cfg from '../../../spine/start/01-venv/captured/.venv/pyvenv.cfg?raw'
import session from '../../../spine/start/01-venv/session.txt?raw'

// §1 — an empty folder and a venv. Every path below is in the session (which python, before and
// after activate; sys.prefix / sys.base_prefix; readlink) or the captured pyvenv.cfg. site-packages
// holding only pip and a .gitignore of `*` are a fresh 3.15.1 venv's real content (checked with ls
// and cat).
export const startVenv: SceneModel = ideFrame2({
  model: 'A venv borrows the interpreter, owns its packages',
  tree: [venvOpen('pyvenv.cfg')],
  editor: { file: '.venv/pyvenv.cfg', code: cfg, lang: 'text', highlight: [1, 3] },
  session,
  side: [
    {
      type: 'group', id: 'venv', title: 'expense-tracker/.venv', icon: 'python', tone: 'store', dir: 'grid', cols: 2, children: [
        { type: 'item', id: 'venv-site', title: 'site-packages', sub: 'this project’s packages', icon: 'package' },
        { type: 'item', id: 'venv-ignore', title: '.gitignore', sub: '*: git skips it all', icon: 'branch' },
        { type: 'item', id: 'venv-python', title: 'bin/python', sub: 'what python runs', icon: 'terminal' },
        { type: 'item', id: 'venv-cfg', title: 'pyvenv.cfg', sub: 'where it came from', icon: 'file' },
      ],
    },
    {
      type: 'group', id: 'system', title: '/usr/local: installed once', icon: 'cpu', tone: 'source', dir: 'grid', cols: 2, children: [
        { type: 'item', id: 'sys-python', title: 'bin/python3.15', sub: 'the interpreter', icon: 'cpu' },
        { type: 'item', id: 'sys-lib', title: 'lib/python3.15', sub: 'the standard library', icon: 'layers' },
      ],
    },
    {
      type: 'table', id: 'which', title: 'Asked in the terminal', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        { cells: ['which, before', '/usr/local/bin/python'] },
        { cells: ['which, after', '….venv/bin/python'], tone: 'store' },
        { cells: ['base_prefix', '/usr/local'] },
        { cells: ['readlink', '/usr/local/bin/python3.15'] },
      ],
    },
  ],
  edges: [
    { from: 'venv-python', to: 'system', label: 'a link to' },
    { from: 'venv-cfg', to: 'system', label: 'home =' },
  ],
})
