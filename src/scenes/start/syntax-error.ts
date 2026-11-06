import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { lineOf } from '../ide'
import { project2 } from './tree'
import code from '../../../spine/start/05-syntax-error/project/main.py?raw'
import session from '../../../spine/start/05-syntax-error/session.txt?raw'

// §5 — a SyntaxError: the parser reads the whole file before any of it runs, so line 3's print,
// which is fine, never prints. The anatomy rows are the session's four lines.
export const startSyntaxError: SceneModel = ideFrame2({
  model: 'The whole file is parsed before line 1 runs',
  tree: project2('active'),
  editor: { file: 'main.py', code, highlight: [lineOf(code, 'Today so far')] },
  session,
  side: [
    { type: 'item', id: 'p-file', title: 'main.py, all five lines', icon: 'file', tone: 'neutral' },
    { type: 'item', id: 'p-parser', title: 'the parser reads the whole file', sub: 'checks every bracket and colon', icon: 'search', tone: 'ingest' },
    { type: 'item', id: 'p-error', title: 'SyntaxError at line 5', sub: 'so no line runs: not even line 3', icon: 'bell', tone: 'consume' },
    {
      type: 'table', id: 'anatomy', title: 'Reading the error', tone: 'consume', columns: ['the terminal says', 'meaning'], rows: [
        ['File "…", line 5', 'where'],
        ['print("Today so far:"…', 'the line'],
        ['^', 'the opened bracket'],
        ["'(' was never closed", 'what is wrong'],
      ],
    },
  ],
  edges: [
    { from: 'p-file', to: 'p-parser' },
    { from: 'p-parser', to: 'p-error' },
  ],
})
