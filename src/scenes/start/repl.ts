import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { lineOf } from '../ide'
import { project2 } from './tree'
import code from '../../../spine/start/04-repl/project/main.py?raw'
import session from '../../../spine/start/04-repl/session.txt?raw'

// §4 — the REPL beside the editor: try a line, then write it down. Every answer is the session's.
export const startRepl: SceneModel = ideFrame2({
  model: 'Read, evaluate, print, and wait',
  tree: project2('active'),
  editor: { file: 'main.py', code, highlight: [lineOf(code, 'Today so far')] },
  session,
  side: [
    { type: 'item', id: 'read', title: 'Read', sub: 'the line you type at >>>', icon: 'file', tone: 'neutral' },
    { type: 'item', id: 'eval', title: 'Evaluate', sub: 'Python runs it', icon: 'cpu', tone: 'ingest' },
    { type: 'item', id: 'print', title: 'Print', sub: 'its value, without being asked', icon: 'screen', tone: 'store' },
    {
      type: 'table', id: 'typed', title: 'Typed at >>>', tone: 'ingest', columns: ['typed', 'Python answers'], rows: [
        ['4.50', '4.5'],
        { id: 'sum', cells: ['4.50 + 12.99', '17.490000000000002'], tone: 'consume' },
        { id: 'upper', cells: ['"Café Lumen".upper()', "'CAFÉ LUMEN'"] },
      ],
    },
  ],
  edges: [
    { from: 'read', to: 'eval' },
    { from: 'eval', to: 'print' },
  ],
})
