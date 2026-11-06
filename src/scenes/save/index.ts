import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import c1 from '../../../spine/save/01-files/project/main.py?raw'
import s1 from '../../../spine/save/01-files/session.txt?raw'
import c2 from '../../../spine/save/02-json/project/main.py?raw'
import s2 from '../../../spine/save/02-json/session.txt?raw'
import j2 from '../../../spine/save/02-json/captured/expenses.json?raw'
import c3 from '../../../spine/save/03-pathlib/project/main.py?raw'
import s3 from '../../../spine/save/03-pathlib/session.txt?raw'
import c4 from '../../../spine/save/04-encodings/project/main.py?raw'
import s4 from '../../../spine/save/04-encodings/session.txt?raw'
import c5 from '../../../spine/save/05-csv/project/main.py?raw'
import s5 from '../../../spine/save/05-csv/session.txt?raw'
import c6 from '../../../spine/save/06-validating/project/main.py?raw'
import s6 from '../../../spine/save/06-validating/session.txt?raw'

// Course 5 — save it, import the bank, on IDE frame v2: each side pane is titled with the section's
// mental model and holds one diagram and at most one table. Every value in it is in the step's
// session or files.
const venvClosed: TreeEntry = { name: '.venv', folder: true, state: 'muted' }
const file = 'main.py'
const flat: TreeEntry[] = [venvClosed, { name: 'main.py', state: 'active' }]
const withData = (state?: 'new'): TreeEntry[] => [
  venvClosed,
  { name: 'data', state, children: [
    { name: 'bank', children: [{ name: 'bank-2026-09.csv' }, { name: 'bank-2026-10.csv' }] },
    { name: 'expenses.json' },
  ] },
  { name: 'main.py', state: 'active' },
]

// §1 — files and with: open, write, close — and with closes it even on an error.
const files1 = ideFrame2({
  model: "with closes the file, even on an error", tree: flat, editor: { file, code: c1, highlight: linesFrom(c1, 'def save_text(', 'file.write(') }, session: s1,
  side: [
    {
      type: 'group', id: 'flow', title: 'with open("expenses.txt", "w") as file:', icon: 'file', tone: 'ingest', children: [
        { type: 'item', id: 'open', title: 'open', sub: '"w": create it, or empty it', icon: 'file' },
        { type: 'item', id: 'write', title: 'file.write(…), 7 times', sub: 'one line per expense', icon: 'code' },
        { type: 'item', id: 'close', title: 'close', sub: 'with does it, at the end of the block', icon: 'lock', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'onerror', title: 'If a write fails halfway', tone: 'consume', columns: ['', 'the file'], rows: [
        ['without with', 'left open, half written'], { id: 'w', cells: ['with with', 'closed; the error goes on'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'open', to: 'write' }, { from: 'write', to: 'close' }],
})

// §2 — JSON: Python types to JSON types; the Decimal needs a decision.
const json2 = ideFrame2({
  model: "Python types become JSON types", tree: [venvClosed, { name: 'expenses.json', state: 'new' }, { name: 'main.py', state: 'active' }],
  editor: { file, code: c2, highlight: linesFrom(c2, 'def save(', 'json.dump(') }, session: s2,
  side: [
    {
      type: 'group', id: 'map', title: 'Python → JSON', icon: 'workflow', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'py', title: 'Python', rows: [{ id: 'list', cells: ['list'] }, { id: 'dict', cells: ['dict'] }, { id: 'str', cells: ['str'] }, { id: 'dec', cells: ['Decimal'] }] },
        { type: 'table', id: 'js', title: 'JSON', rows: [{ id: 'arr', cells: ['array [ ]'] }, { id: 'obj', cells: ['object { }'] }, { id: 'jstr', cells: ['string'] }, { id: 'jdec', cells: ['string "4.50"'], tone: 'store' }] },
      ],
    },
    { type: 'code', id: 'saved', lang: 'text', filename: 'expenses.json, as saved', code: j2, show: [[1, 7]] },
  ],
  edges: [{ from: 'py.list', to: 'js.arr' }, { from: 'py.dict', to: 'js.obj' }, { from: 'py.str', to: 'js.jstr' }, { from: 'py.dec', to: 'js.jdec' }],
})

// §3 — pathlib: a path is an object with parts.
const path3 = ideFrame2({
  model: "A path is an object with parts", tree: withData('new'), editor: { file, code: c3, highlight: linesFrom(c3, 'DATA = Path(', 'BANK = DATA') }, session: s3,
  side: [
    {
      type: 'group', id: 'parts', title: 'p = Path("data") / "bank" / …', icon: 'folder', tone: 'ingest', children: [
        { type: 'item', id: 'p', title: 'p: a PosixPath', sub: 'data/bank/bank-2026-10.csv', icon: 'file' },
        { type: 'table', id: 'attrs', columns: ['part', 'value'], rows: [
          { id: 'parent', cells: ['p.parent', "data/bank"] }, { id: 'name', cells: ['p.name', "'bank-2026-10.csv'"] },
          { id: 'stem', cells: ['p.stem', "'bank-2026-10'"] }, { id: 'suffix', cells: ['p.suffix', "'.csv'"] },
        ] },
      ],
    },
    {
      type: 'table', id: 'glob', title: 'sorted(BANK.glob("*.csv"))', tone: 'store', columns: ['match', 'size'], rows: [
        ['bank-2026-09.csv', '205 bytes'], ['bank-2026-10.csv', '437 bytes'],
      ],
    },
  ],
  edges: [{ from: 'p', to: 'attrs' }],
})

// §4 — text and encodings: one byte, two readings.
const enc4 = ideFrame2({
  model: "Text is bytes plus an encoding", tree: withData(), editor: { file, code: c4, highlight: linesFrom(c4, 'def read_export(', 'return path.read_text(encoding') }, session: s4,
  side: [
    { type: 'item', id: 'byte', title: '0xC9, at position 47', sub: 'one byte on disk', icon: 'disk', tone: 'neutral' },
    {
      type: 'group', id: 'ways', bare: true, dir: 'row', children: [
        { type: 'item', id: 'utf8', title: 'as UTF-8', sub: 'invalid continuation byte', icon: 'bell', tone: 'consume' },
        { type: 'item', id: 'latin', title: "as Latin-1: 'É'", sub: "'CAFÉ MÜLLER'", icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'pep', title: 'What open() assumes', tone: 'ingest', columns: ['Python', 'default encoding'], rows: [
        ['3.14 and before', "the system's"], { id: 'new', cells: ['3.15 (PEP 686)', 'UTF-8 everywhere'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'byte', to: 'utf8' }, { from: 'byte', to: 'latin' }],
})

// §5 — CSV: the header becomes the keys, each line a dict.
const csv5 = ideFrame2({
  model: "The header becomes each row's keys", tree: withData(), editor: { file, code: c5, highlight: linesFrom(c5, 'def read_rows(', 'return list(csv.DictReader') }, session: s5,
  side: [
    {
      type: 'group', id: 'reader', title: 'DictReader: line 2, a dict', icon: 'table', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'header', title: 'the header: keys', rows: [{ id: 'date', cells: ['date'] }, { id: 'description', cells: ['description'] }, { id: 'amount', cells: ['amount'] }, { id: 'currency', cells: ['currency'] }] },
        { type: 'table', id: 'row', title: 'its values', rows: [
          { id: 'k-date', cells: ["'2026-10-06'"] }, { id: 'k-desc', cells: ["'TESCO STORES 2041'"] },
          { id: 'k-amount', cells: ["'23.85': a str"], tone: 'consume' }, { id: 'k-cur', cells: ["'GBP'"] },
        ] },
      ],
    },
    {
      type: 'table', id: 'counts', title: 'The import command', tone: 'store', columns: ['file', 'rows'], rows: [['bank-2026-09.csv', '5'], ['bank-2026-10.csv', '12']],
    },
  ],
  edges: [
    { from: 'header.date', to: 'row.k-date' }, { from: 'header.description', to: 'row.k-desc' },
    { from: 'header.amount', to: 'row.k-amount' }, { from: 'header.currency', to: 'row.k-cur' },
  ],
})

// §6 — validating rows: keep the good, report the bad, with the reason.
const valid6 = ideFrame2({
  model: "Keep the good rows; report the bad, with why", tree: withData(), editor: { file, code: c6, highlight: [lineOf(c6, 'if not row["date"]'), lineOf(c6, 'if row["currency"]'), lineOf(c6, 'amount = parse_amount(row'), lineOf(c6, 'if key in seen')],
    // validate's four checks, the diagram's four questions
    show: [[lineOf(c6, 'if not row["date"]'), lineOf(c6, 'if key in seen')]] }, session: s6,
  side: [
    { type: 'item', id: 'v-date', title: 'a date?', icon: 'clock', tone: 'ingest' },
    { type: 'item', id: 'v-cur', title: 'in GBP?', icon: 'globe' },
    { type: 'item', id: 'v-amount', title: 'a positive amount?', icon: 'card' },
    { type: 'item', id: 'v-dup', title: 'seen before?', sub: 'no: kept, as category other', tone: 'store', icon: 'fingerprint' },
    {
      type: 'table', id: 'result', title: 'bank-2026-10.csv: 7 imported, 5 rejected', tone: 'ingest', columns: ['line', 'rejected because'], rows: [
        ['6', 'a duplicate'], ['9', "not a number: '12,50'"], ['10', 'no date'], ['11', 'not more than zero'], ['12', 'in EUR: needs a rate'],
      ],
    },
  ],
  edges: [
    { from: 'v-date', to: 'v-cur' }, { from: 'v-cur', to: 'v-amount' },
    { from: 'v-amount', to: 'v-dup' },
  ],
})

export const saveScenes: Record<string, SceneModel> = {
  'save-files': files1, 'save-json': json2, 'save-pathlib': path3, 'save-encodings': enc4, 'save-csv': csv5, 'save-validating': valid6,
}
