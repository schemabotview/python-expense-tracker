import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { project } from './tree'
import code from '../../../spine/start/04-repl/project/main.py?raw'
import session from '../../../spine/start/04-repl/session.txt?raw'

// §4 — the REPL beside the editor: try a line, then write it down. Every answer is the session's.
export const startRepl: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'main.py', code, highlight: [lineOf(code, 'Today so far')] },
  session,
  side: [
    {
      type: 'group', id: 'loop', title: 'python -q: the REPL', icon: 'terminal', tone: 'ingest', children: [
        { type: 'item', id: 'read', title: 'Read', sub: 'the line you type', icon: 'file' },
        { type: 'item', id: 'eval', title: 'Evaluate', sub: 'Python runs it', icon: 'cpu' },
        { type: 'item', id: 'print', title: 'Print', sub: 'its value, back', icon: 'screen' },
      ],
    },
    {
      type: 'table', id: 'typed', title: 'Typed at >>>', tone: 'ingest', columns: ['typed', 'Python answers'], rows: [
        ['4.50', '4.5'],
        { id: 'sum', cells: ['4.50 + 12.99', '17.490000000000002'], tone: 'consume' },
        { id: 'upper', cells: ['"Café Lumen".upper()', "'CAFÉ LUMEN'"] },
      ],
    },
    {
      type: 'table', id: 'versus', title: 'The REPL and the file', tone: 'ingest', columns: ['', 'the REPL', 'main.py'], rows: [
        ['runs', 'one line at a time', 'the whole file, in order'],
        ['shows', 'every value', 'only what you print'],
        ['keeps', 'nothing, after exit()', 'every line, saved'],
        ['for', 'trying a line', 'the app'],
      ],
    },
    { type: 'note', id: 'repl-note', tone: 'consume', text: 'Coffee plus lunch is 17.49, not 17.490000000000002: a float cannot hold 12.99 exactly. Course 3 fixes the money with Decimal.' },
  ],
  edges: [
    { from: 'read', to: 'eval' },
    { from: 'eval', to: 'print' },
  ],
})
