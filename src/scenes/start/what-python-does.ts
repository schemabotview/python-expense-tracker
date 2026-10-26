import type { Code, SceneModel } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from './../ide'
import { outputOf } from '../lab'
import code from '../../../spine/start/03-what-python-does/project/main.py?raw'
import session from '../../../spine/start/03-what-python-does/session.txt?raw'

// §3 — ◆ full scene: what `python main.py` does. One file through CPython's stages, each stage
// holding its REAL output from the lab (tokenize, ast, dis), cut to line 4 by text, never retyped.
// Laid out as a serpentine so every arrow crosses one gap: compile along the top, run back along
// the bottom. The value stack is CPython 3.15's for line 4's six instructions.
const tokens = outputOf(session, 'python -m tokenize main.py')
const tree = outputOf(session, 'python -m ast main.py')
const bytecode = outputOf(session, 'python -m dis main.py')
const run = outputOf(session, 'python main.py')
const cache = outputOf(session, 'ls __pycache__')

// Line 4's part of a tool's output: shown, the rest folded, and tinted. `from` skips line 3's part
// where both lines print the same text (the ast's two `Expr(`).
const line4 = (text: string, first: string, last: string, from = 1): Pick<Code, 'show' | 'highlight'> => {
  const a = lineOf(text, first, from)
  const lines = linesFrom(text.split('\n').slice(a - 1).join('\n'), first, last).map((n) => n + a - 1)
  return { show: [[lines[0], lines.at(-1)!]], highlight: lines }
}

export const startWhatPythonDoes: SceneModel = {
  title: 'What python main.py does',
  sub: 'CPython 3.15.1: compile the whole file once, then run it',
  nodes: [
    {
      type: 'group', id: 'stages', bare: true, dir: 'grid', cols: 3, children: [
        {
          type: 'group', id: 'source', badge: 1, title: 'Source', sub: 'the text you wrote', icon: 'file', tone: 'ingest', children: [
            { type: 'code', id: 'src', filename: 'main.py', code, highlight: [lineOf(code, 'print("Coffee')] },
          ],
        },
        {
          type: 'group', id: 'tokens', badge: 2, title: 'Tokens', sub: 'python -m tokenize main.py', icon: 'filter', tone: 'ingest', children: [
            { type: 'code', id: 'tok', lang: 'text', code: tokens, ...line4(tokens, '4,0-4,5', '4,36-4,37') },
          ],
        },
        {
          type: 'group', id: 'ast', badge: 3, title: 'Syntax tree', sub: 'python -m ast main.py', icon: 'workflow', tone: 'ingest', children: [
            { type: 'code', id: 'tree', lang: 'text', code: tree, ...line4(tree, 'Expr(', 'Constant(value=4.5)', lineOf(tree, 'Expr(') + 1) },
          ],
        },
        {
          type: 'group', id: 'output', badge: 6, title: 'Output', sub: 'what print wrote', icon: 'screen', tone: 'store', children: [
            { type: 'code', id: 'out', terminal: true, filename: 'terminal', code: `$ python main.py\n${run}` },
            { type: 'note', id: 'out-note', text: 'Constant(value=4.5): the zero was gone at step 3, long before print.' },
          ],
        },
        {
          type: 'group', id: 'vm', badge: 5, title: 'The virtual machine', sub: 'runs one instruction at a time', icon: 'cpu', tone: 'store', children: [
            {
              type: 'table', id: 'stack', columns: ['instruction', 'value stack after it'], rows: [
                ['LOAD_NAME print', 'print'],
                ['PUSH_NULL', 'print, NULL'],
                ["LOAD_CONST 'Coffee…'", "print, NULL, 'Coffee…'"],
                ['LOAD_CONST 4.5', "print, NULL, 'Coffee…', 4.5"],
                { id: 'call', cells: ['CALL 2', 'None — print ran'], tone: 'store' },
                ['POP_TOP', '(empty)'],
              ],
            },
          ],
        },
        {
          type: 'group', id: 'bytecode', badge: 4, title: 'Bytecode', sub: 'python -m dis main.py', icon: 'code', tone: 'ingest', children: [
            { type: 'code', id: 'dis', lang: 'text', code: bytecode, ...line4(bytecode, '  4           LOAD_NAME', 'POP_TOP') },
            { type: 'item', id: 'pyc', title: `__pycache__/${cache}`, sub: 'an imported module keeps its bytecode here', icon: 'disk' },
          ],
        },
      ],
    },
  ],
  edges: [
    { from: 'source', to: 'tokens', label: 'split' },
    { from: 'tokens', to: 'ast', label: 'parse' },
    { from: 'ast', to: 'bytecode', label: 'compile' },
    { from: 'bytecode', to: 'vm', label: 'run' },
    { from: 'vm', to: 'output', label: 'print' },
  ],
}
