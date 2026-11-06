import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { lineOf } from '../ide'
import { project2 } from './tree'
import code from '../../../spine/start/06-name-error/project/main.py?raw'
import session from '../../../spine/start/06-name-error/session.txt?raw'

// §6 — a NameError: the file parses, runs, prints line 3, and fails only when line 4 looks up a name
// nobody defined. print and len are built-ins; prnt is in neither namespace searched.
export const startNameError: SceneModel = ideFrame2({
  model: 'A name is looked up when its line runs',
  tree: project2('active'),
  editor: { file: 'main.py', code, highlight: [lineOf(code, 'prnt(')] },
  session,
  side: [
    { type: 'item', id: 'ns-module', title: "main.py's own names", sub: 'nothing called prnt', icon: 'file', tone: 'neutral' },
    { type: 'item', id: 'ns-builtins', title: 'the built-ins', sub: 'print, len, … but no prnt', icon: 'python', tone: 'ingest' },
    { type: 'item', id: 'ns-error', title: 'NameError', sub: "Did you mean: 'print'?", icon: 'bell', tone: 'consume' },
    {
      type: 'table', id: 'two-errors', title: 'Two kinds of mistake', tone: 'ingest', columns: ['', 'SyntaxError', 'NameError'], rows: [
        ['found by', 'the parser', 'the run'],
        ['when', 'before line 1', 'at its line'],
        ['lines above', 'never ran', 'already ran'],
      ],
    },
  ],
  edges: [
    { from: 'ns-module', to: 'ns-builtins', label: 'not here' },
    { from: 'ns-builtins', to: 'ns-error', label: 'not here' },
  ],
})
