import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { project } from './tree'
import code from '../../../spine/start/06-name-error/project/main.py?raw'
import session from '../../../spine/start/06-name-error/session.txt?raw'

// §6 — a NameError: the file parses, runs, prints line 3, and fails only when line 4 looks up a name
// nobody defined. print and len are built-ins; prnt is in neither namespace searched.
export const startNameError: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'main.py', code, highlight: [lineOf(code, 'prnt(')] },
  session,
  side: [
    {
      type: 'table', id: 'ran', title: 'This time, the file runs', tone: 'ingest', columns: ['line', 'what happened'], rows: [
        { id: 'r3', cells: ['3', 'printed expense-tracker: starting'], tone: 'store' },
        { id: 'r4', cells: ['4', 'raised NameError'], tone: 'consume' },
        { id: 'r5', cells: ['5', 'never ran'] },
      ],
    },
    {
      type: 'group', id: 'lookup', title: 'Line 4 looks up prnt', icon: 'search', tone: 'ingest', children: [
        { type: 'item', id: 'ns-module', title: "main.py's own names", sub: 'nothing called prnt', icon: 'file' },
        { type: 'item', id: 'ns-builtins', title: 'the built-ins', sub: 'print, len, … but no prnt', icon: 'python' },
        { type: 'item', id: 'ns-error', title: "NameError: name 'prnt' is not defined", sub: "Did you mean: 'print'?", icon: 'bell', tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'two-errors', title: 'Two kinds of mistake', tone: 'ingest', columns: ['', 'SyntaxError', 'NameError'], rows: [
        ['found by', 'the parser', 'the running file'],
        ['found when', 'before line 1 runs', 'at the bad line'],
        ['earlier lines', 'never ran', 'already ran'],
      ],
    },
    { type: 'note', id: 'last-line', tone: 'ingest', text: "Read a traceback from the bottom: the error's type, its message (here with Python's own suggestion), then the line it points at." },
  ],
  edges: [
    { from: 'ns-module', to: 'ns-builtins' },
    { from: 'ns-builtins', to: 'ns-error' },
  ],
})
