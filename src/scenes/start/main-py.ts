import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { project } from './tree'
import code from '../../../spine/start/02-main/project/main.py?raw'
import session from '../../../spine/start/02-main/session.txt?raw'

// §2 — main.py, run from the terminal: a file is read top to bottom, and print writes one line.
// 4.50 prints as 4.5: the float keeps the number, not how it was typed (§3 shows where the zero goes).
export const startMain: SceneModel = ideFrame({
  tree: project('new'),
  editor: { file: 'main.py', code, highlight: [3, 4] },
  session,
  side: [
    {
      type: 'group', id: 'run', title: 'python main.py', icon: 'terminal', tone: 'ingest', children: [
        { type: 'item', id: 'run-file', title: 'main.py', sub: 'a text file', icon: 'file' },
        { type: 'item', id: 'run-python', title: 'python', sub: 'reads it, top to bottom', icon: 'python' },
        { type: 'item', id: 'run-term', title: 'the terminal', sub: 'where print writes', icon: 'screen' },
      ],
    },
    {
      type: 'table', id: 'lines', title: 'Line by line', tone: 'ingest', columns: ['line', 'what happens'], rows: [
        { id: 'l1', cells: ['1', 'a comment: Python skips it'] },
        { id: 'l2', cells: ['2', 'blank: nothing'] },
        { id: 'l3', cells: ['3', 'prints expense-tracker: starting'], tone: 'store' },
        { id: 'l4', cells: ['4', 'prints Coffee at Café Lumen: 4.5'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'args', title: 'Line 4 gives print two arguments', tone: 'store', columns: ['argument', 'a', 'printed as'], rows: [
        ['"Coffee at Café Lumen:"', 'str', 'Coffee at Café Lumen:'],
        { id: 'price', cells: ['4.50', 'float', '4.5'], tone: 'consume' },
        { id: 'joined', cells: ['joined by a space', '', 'Coffee at Café Lumen: 4.5'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'zero', tone: 'consume', text: 'We typed 4.50 and got 4.5. A float keeps the number, not the way it was written: no quotes, no trailing zero.' },
  ],
  edges: [
    { from: 'run-file', to: 'run-python' },
    { from: 'run-python', to: 'run-term' },
  ],
})
