import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { project } from './tree'
import code from '../../../spine/start/05-syntax-error/project/main.py?raw'
import session from '../../../spine/start/05-syntax-error/session.txt?raw'

// §5 — a SyntaxError: the parser reads the whole file before any of it runs, so line 3's print,
// which is fine, never prints. The anatomy rows are the session's four lines.
export const startSyntaxError: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'main.py', code, highlight: [lineOf(code, 'Today so far')] },
  session,
  side: [
    {
      type: 'group', id: 'parse', title: 'Before anything runs', icon: 'search', tone: 'ingest', children: [
        { type: 'item', id: 'p-file', title: 'main.py, all five lines', icon: 'file' },
        { type: 'item', id: 'p-parser', title: 'the parser reads the whole file', sub: 'checks every bracket and colon', icon: 'search' },
        { type: 'item', id: 'p-error', title: 'SyntaxError at line 5', sub: 'so no line runs: not even line 3', icon: 'bell', tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'ran', title: 'Which lines ran', tone: 'ingest', columns: ['line', 'what happened'], rows: [
        { id: 'r3', cells: ['3', 'never ran, though it is correct'] },
        { id: 'r4', cells: ['4', 'never ran'] },
        { id: 'r5', cells: ['5', 'the parser stopped here'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'anatomy', title: 'Reading the error', tone: 'consume', columns: ['the terminal says', 'meaning'], rows: [
        ['File "…/main.py", line 5', 'where'],
        ['print("Today so far:", …', 'the line'],
        ['^', 'the bracket it opened'],
        ["SyntaxError: '(' was never closed", 'what is wrong'],
      ],
    },
    { type: 'note', id: 'caret', tone: 'consume', text: 'The caret marks the bracket that was opened. The missing one belongs at the end of the line: the mistake is often after where the caret points.' },
  ],
  edges: [
    { from: 'p-file', to: 'p-parser' },
    { from: 'p-parser', to: 'p-error' },
  ],
})
