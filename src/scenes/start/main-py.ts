import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame2 } from '../frame'
import { project2 } from './tree'
import code from '../../../spine/start/02-main/project/main.py?raw'
import session from '../../../spine/start/02-main/session.txt?raw'

// §2 — main.py, run from the terminal: a file is read top to bottom, and print writes one line.
// 4.50 prints as 4.5: the float keeps the number, not how it was typed (§3 shows where the zero goes).
export const startMain: SceneModel = ideFrame2({
  model: 'A file, read top to bottom',
  tree: project2('new'),
  editor: { file: 'main.py', code, highlight: [3, 4] },
  session,
  side: [
    { type: 'item', id: 'run-file', title: 'main.py', sub: 'a text file', icon: 'file', tone: 'neutral' },
    { type: 'item', id: 'run-python', title: 'python', sub: 'reads it, top to bottom, one line at a time', icon: 'python', tone: 'ingest' },
    { type: 'item', id: 'run-term', title: 'the terminal', sub: 'where print writes', icon: 'screen', tone: 'store' },
    {
      type: 'table', id: 'args', title: 'Line 4 gives print two arguments', tone: 'store', columns: ['argument', 'a', 'printed as'], rows: [
        ['"Coffee at…"', 'str', 'Coffee at…'],
        { id: 'price', cells: ['4.50', 'float', '4.5'], tone: 'consume' },
      ],
    },
  ],
  edges: [
    { from: 'run-file', to: 'run-python' },
    { from: 'run-python', to: 'run-term' },
  ],
})
