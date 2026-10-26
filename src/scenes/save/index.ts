import type { SceneModel, TreeEntry } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { venvClosed } from '../start/tree'
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

// Course 5 — save it, import the bank. Every value in a side pane is in the step's session or files.
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
const files1 = ideFrame({
  tree: flat, editor: { file, code: c1, ...view(c1, 'def save_text('), highlight: linesFrom(c1, 'def save_text(', 'file.write(') }, session: s1,
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
        ['without with', 'left open, half written'], { id: 'w', cells: ['with with', 'closed, then the error goes on'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'head', title: 'head -n 3 expenses.txt', tone: 'store', rows: [
        ['2026-10-01|Café Lumen|4.50|food'], ['2026-10-01|Noodle Bar|12.99|food'], ['2026-10-01|Metro|2.80|transport'],
      ],
    },
    {
      type: 'table', id: 'modes', title: 'open modes', tone: 'ingest', columns: ['mode', 'means'], rows: [['"r"', 'read (the default)'], ['"w"', 'write: replaces the file'], ['"a"', 'append to the end']],
    },
    { type: 'note', id: 'f-note', tone: 'ingest', text: 'The data now outlives the program. But a line of text has lost its types: 4.50 is just four characters again.' },
  ],
  edges: [{ from: 'open', to: 'write' }, { from: 'write', to: 'close' }],
})

// §2 — JSON: Python types to JSON types; the Decimal needs a decision.
const json2 = ideFrame({
  tree: [venvClosed, { name: 'expenses.json', state: 'new' }, { name: 'main.py', state: 'active' }],
  editor: { file, code: c2, ...view(c2, 'def load(', 'expenses = list(SAMPLE)'), highlight: linesFrom(c2, 'def save(', 'json.dump(') }, session: s2,
  side: [
    {
      type: 'group', id: 'map', title: 'Python → JSON', icon: 'workflow', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'py', title: 'Python', rows: [{ id: 'list', cells: ['list'] }, { id: 'dict', cells: ['dict'] }, { id: 'str', cells: ['str'] }, { id: 'dec', cells: ['Decimal'] }] },
        { type: 'table', id: 'js', title: 'JSON', rows: [{ id: 'arr', cells: ['array [ ]'] }, { id: 'obj', cells: ['object { }'] }, { id: 'jstr', cells: ['string'] }, { id: 'jdec', cells: ['string "4.50": our decision'], tone: 'store' }] },
      ],
    },
    { type: 'code', id: 'saved', lang: 'text', filename: 'expenses.json, as saved', code: j2, show: [[1, 7]] },
    {
      type: 'table', id: 'why', title: 'Why the amount is a string', tone: 'consume', columns: ['saved as', 'loaded back as'], rows: [
        ['4.50 (a JSON number)', 'a float: 4.5'], { id: 's', cells: ['"4.50"', 'Decimal("4.50")'], tone: 'store' },
      ],
    },
    { type: 'table', id: 'runs', title: 'Two runs, one file', tone: 'store', columns: ['run', 'did'], rows: [['1', 'add snacks, save 8 expenses'], ['2', 'load, then list fun: snacks is there']] },
    { type: 'note', id: 'j-note', tone: 'store', text: 'The second run listed snacks: load() read back what save() wrote. ensure_ascii=False keeps Café readable.' },
  ],
  edges: [{ from: 'py.list', to: 'js.arr' }, { from: 'py.dict', to: 'js.obj' }, { from: 'py.str', to: 'js.jstr' }, { from: 'py.dec', to: 'js.jdec' }],
})

// §3 — pathlib: a path is an object with parts.
const path3 = ideFrame({
  tree: withData('new'), editor: { file, code: c3, ...view(c3, 'DATA = Path(', 'BANK = DATA', 5), highlight: linesFrom(c3, 'DATA = Path(', 'BANK = DATA') }, session: s3,
  side: [
    {
      type: 'group', id: 'parts', title: 'p = Path("data") / "bank" / "bank-2026-10.csv"', icon: 'folder', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'p', title: 'p', sub: 'a PosixPath', icon: 'file' },
        { type: 'table', id: 'attrs', columns: ['part', 'value'], rows: [
          { id: 'parent', cells: ['p.parent', "data/bank"] }, { id: 'name', cells: ['p.name', "'bank-2026-10.csv'"] },
          { id: 'stem', cells: ['p.stem', "'bank-2026-10'"] }, { id: 'suffix', cells: ['p.suffix', "'.csv'"] },
        ] },
      ],
    },
    {
      type: 'table', id: 'glob', title: 'BANK.glob("*.csv"), sorted: the exports command', tone: 'store', columns: ['match', 'size'], rows: [
        ['bank-2026-09.csv', '205 bytes'], ['bank-2026-10.csv', '437 bytes'],
      ],
    },
    {
      type: 'table', id: 'ops', title: 'Used in main.py', tone: 'ingest', columns: ['code', 'does'], rows: [
        ['DATA / "expenses.json"', 'joins parts with /'], ['SAVED.open("w")', 'opens the file'], ['path.stat().st_size', 'its size in bytes'],
      ],
    },
    {
      type: 'table', id: 'repl', title: 'The REPL answered', tone: 'store', rows: [["(PosixPath('data/bank'),"], ["'bank-2026-10.csv', 'bank-2026-10', '.csv')"]],
    },
    { type: 'item', id: 'cap', title: 'One place for data', icon: 'folder', tone: 'ingest', bullets: ['the sample week left the code', 'data/expenses.json is loaded at start'] },
    { type: 'note', id: 'p-note', tone: 'ingest', text: 'Ana keeps her bank exports in data/bank. / builds paths the right way on every system, Windows included.' },
  ],
  edges: [{ from: 'p', to: 'attrs' }],
})

// §4 — text and encodings: one byte, two readings.
const enc4 = ideFrame({
  tree: withData(), editor: { file, code: c4, ...view(c4, 'def read_export(', 'expenses = load()'), highlight: linesFrom(c4, 'def read_export(', 'return path.read_text(encoding') }, session: s4,
  side: [
    {
      type: 'group', id: 'decode', title: 'The byte 0xC9 (position 47), two ways', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'byte', title: '0xC9', sub: 'one byte on disk', icon: 'disk' },
        { type: 'group', id: 'ways', bare: true, children: [
          { type: 'item', id: 'utf8', title: 'as UTF-8', sub: 'invalid continuation byte', icon: 'bell', tone: 'consume' },
          { type: 'item', id: 'latin', title: "as Latin-1: 'É'", sub: "'CAFÉ MÜLLER'", icon: 'check', tone: 'store' },
        ] },
      ],
    },
    {
      type: 'table', id: 'pep', title: 'What open() assumes', tone: 'ingest', columns: ['Python', 'default encoding'], rows: [
        ['3.14 and before', "the system's: differs per machine"], { id: 'new', cells: ['3.15 (PEP 686)', 'UTF-8, everywhere'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'files', title: "Ana's exports", tone: 'ingest', columns: ['file', 'encoding'], rows: [
        ['bank-2026-09.csv', 'Latin-1: an old bank app'], ['bank-2026-10.csv', 'UTF-8'],
      ],
    },
    {
      type: 'table', id: 'answers', title: 'The REPL', tone: 'ingest', columns: ['typed', 'answer'], rows: [
        { id: 'u', cells: ['raw.decode()', 'UnicodeDecodeError'], tone: 'consume' }, { id: 'l', cells: ['raw[44:55].decode("latin-1")', "'CAFÉ MÜLLER'"], tone: 'store' },
      ],
    },
    { type: 'item', id: 'cap', title: 'Text is bytes plus an encoding', icon: 'file', tone: 'ingest', bullets: ['read_export tries UTF-8 first', 'then falls back to Latin-1'] },
    { type: 'note', id: 'e-note', tone: 'consume', text: 'Latin-1 never fails, so it must go LAST: it would read a UTF-8 file as nonsense without a word of complaint.' },
  ],
  edges: [{ from: 'byte', to: 'utf8' }, { from: 'byte', to: 'latin' }],
})

// §5 — CSV: the header becomes the keys, each line a dict.
const csv5 = ideFrame({
  tree: withData(), editor: { file, code: c5, ...view(c5, 'def read_rows(', 'expenses = load()'), highlight: linesFrom(c5, 'def read_rows(', 'return list(csv.DictReader') }, session: s5,
  side: [
    {
      type: 'group', id: 'reader', title: 'csv.DictReader: line 2 of bank-2026-10.csv', icon: 'table', tone: 'ingest', dir: 'row', children: [
        { type: 'table', id: 'header', title: 'line 1: the header', rows: [{ id: 'date', cells: ['date'] }, { id: 'description', cells: ['description'] }, { id: 'amount', cells: ['amount'] }, { id: 'currency', cells: ['currency'] }] },
        { type: 'table', id: 'row', title: 'one dict per line', columns: ['key', 'value'], rows: [
          { id: 'k-date', cells: ['date', "'2026-10-06'"] }, { id: 'k-desc', cells: ['description', "'TESCO STORES 2041'"] },
          { id: 'k-amount', cells: ['amount', "'23.85': a string"], tone: 'consume' }, { id: 'k-cur', cells: ['currency', "'GBP'"] },
        ] },
      ],
    },
    {
      type: 'table', id: 'counts', title: 'The import command', tone: 'store', columns: ['file', 'rows'], rows: [['bank-2026-09.csv', '5'], ['bank-2026-10.csv', '12']],
    },
    {
      type: 'table', id: 'line9', title: 'Line 9, as written', tone: 'consume', rows: [['2026-10-11,AMZN MKTP UK*9Q1,"12,50",GBP']],
    },
    {
      type: 'table', id: 'fields', title: 'Line 9, as csv reads it: 4 fields', tone: 'store', columns: ['key', 'value'], rows: [['date', "'2026-10-11'"], ['amount', "'12,50'"]],
    },
    { type: 'item', id: 'cap', title: 'Why the csv module', icon: 'table', tone: 'ingest', bullets: ['"12,50" is ONE quoted field', 'split(",") would cut it in two'] },
    { type: 'note', id: 'c-note', tone: 'consume', text: 'Every value arrives as a string, and nothing is checked yet. The next section decides which rows to trust.' },
  ],
  edges: [
    { from: 'header.date', to: 'row.k-date' }, { from: 'header.description', to: 'row.k-desc' },
    { from: 'header.amount', to: 'row.k-amount' }, { from: 'header.currency', to: 'row.k-cur' },
  ],
})

// §6 — validating rows: keep the good, report the bad, with the reason.
const valid6 = ideFrame({
  tree: withData(), editor: { file, code: c6, ...view(c6, 'class InvalidRow(', 'print(path.name, good'), highlight: linesFrom(c6, 'def validate(', 'return (row["date"]') }, session: s6,
  side: [
    {
      type: 'group', id: 'checks', title: 'validate(row): each check can raise', icon: 'filter', tone: 'ingest', children: [
        { type: 'item', id: 'v-date', title: 'a date?', icon: 'clock' },
        { type: 'item', id: 'v-cur', title: 'in GBP?', icon: 'globe' },
        { type: 'item', id: 'v-amount', title: 'a positive amount? parse_amount', icon: 'card' },
        { type: 'item', id: 'v-dup', title: 'seen before?', icon: 'fingerprint' },
        { type: 'item', id: 'v-keep', title: 'kept, as category other', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'result', title: 'bank-2026-10.csv: 7 imported, 5 rejected', tone: 'ingest', columns: ['line', 'rejected because'], rows: [
        ['6', 'a duplicate'], ['9', "not a number: '12,50'"], ['10', 'no date'], ['11', 'must be more than zero: -15.99'], ['12', 'in EUR: needs a rate'],
      ],
    },
  ],
  edges: [
    { from: 'v-date', to: 'v-cur', label: 'yes' }, { from: 'v-cur', to: 'v-amount', label: 'yes' },
    { from: 'v-amount', to: 'v-dup', label: 'yes' }, { from: 'v-dup', to: 'v-keep', label: 'no' },
  ],
})

export const saveScenes: Record<string, SceneModel> = {
  'save-files': files1, 'save-json': json2, 'save-pathlib': path3, 'save-encodings': enc4, 'save-csv': csv5, 'save-validating': valid6,
}
