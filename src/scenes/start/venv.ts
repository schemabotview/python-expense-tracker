import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { venvOpen } from './tree'
import cfg from '../../../spine/start/01-venv/captured/.venv/pyvenv.cfg?raw'
import session from '../../../spine/start/01-venv/session.txt?raw'

// §1 — an empty folder and a venv. Every path below is in the session (which python, before and
// after activate; sys.prefix / sys.base_prefix; readlink) or the captured pyvenv.cfg. site-packages
// holding only pip, bin/pip, bin/activate and a .gitignore of `*` are a fresh 3.15.1 venv's real
// content (checked with ls and cat).
export const startVenv: SceneModel = ideFrame({
  tree: [venvOpen('pyvenv.cfg')],
  editor: { file: '.venv/pyvenv.cfg', code: cfg, lang: 'text', highlight: [1, 3] },
  session,
  side: [
    {
      type: 'group', id: 'pythons', title: 'Two folders, one interpreter', icon: 'python', tone: 'ingest', children: [
        {
          type: 'group', id: 'venv', title: 'expense-tracker/.venv', sub: "this project's Python", tone: 'store', dir: 'grid', cols: 2, children: [
            { type: 'item', id: 'venv-site', title: 'site-packages', sub: 'pip, then this project’s packages', icon: 'package' },
            { type: 'item', id: 'venv-pip', title: 'bin/pip', sub: 'installs into this venv only', icon: 'boxes' },
            { type: 'item', id: 'venv-ignore', title: '.gitignore', sub: '* — git skips the whole folder', icon: 'branch' },
            { type: 'item', id: 'venv-activate', title: 'bin/activate', sub: 'puts .venv/bin first on PATH', icon: 'settings' },
            { type: 'item', id: 'venv-python', title: 'bin/python', sub: 'what python runs, activated', icon: 'terminal' },
            { type: 'item', id: 'venv-cfg', title: 'pyvenv.cfg', sub: 'where it came from', icon: 'file' },
          ],
        },
        {
          type: 'group', id: 'system', title: '/usr/local', sub: 'Python 3.15.1, installed once for the machine', tone: 'source', dir: 'grid', cols: 2, children: [
            { type: 'item', id: 'sys-python', title: 'bin/python3.15', sub: 'the interpreter itself', icon: 'cpu' },
            { type: 'item', id: 'sys-lib', title: 'lib/python3.15', sub: 'the standard library', icon: 'layers' },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'which', title: 'Asked in the terminal', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        { cells: ['which python, before', '/usr/local/bin/python'] },
        { cells: ['which python, after', '…/expense-tracker/.venv/bin/python'], tone: 'store' },
        { cells: ['sys.prefix', '/home/ana/expense-tracker/.venv'], tone: 'store' },
        { cells: ['sys.base_prefix', '/usr/local'] },
        { cells: ['readlink -f .venv/bin/python', '/usr/local/bin/python3.15'] },
      ],
    },
    { type: 'note', id: 'venv-note', tone: 'store', text: 'Activating only puts .venv/bin first on the PATH. The venv borrows the interpreter and the standard library, and keeps its own packages.' },
  ],
  edges: [
    { from: 'venv-python', to: 'system', label: 'a link to' },
    { from: 'venv-cfg', to: 'system', label: 'home =' },
  ],
})
