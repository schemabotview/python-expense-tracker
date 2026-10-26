import type { Group, Item, SceneModel, SceneNode } from '@graphlearning/graphl-flow'

// The app map: what expense-tracker is made of, each part tagged with the course that builds it.
// One scene function, three uses: 1.2 (nothing built yet), 7.4 (the script stages, lit, with the
// real end-to-end output) and 11.4 (everything). A part not yet built is drawn muted.
export interface MapPart { id: string; title: string; sub: string; icon: string; course: number }

export const PARTS: MapPart[] = [
  { id: 'm-cli', title: 'cli', sub: 'argparse: the commands', icon: 'terminal', course: 7 },
  { id: 'm-store', title: 'store', sub: 'files, JSON, encodings, CSV', icon: 'database', course: 5 },
  { id: 'm-bank', title: 'bank', sub: 'validate and import rows', icon: 'filter', course: 5 },
  { id: 'm-categorise', title: 'categorise', sub: 'regex rules', icon: 'search', course: 6 },
  { id: 'm-report', title: 'report', sub: 'budgets, dates, recurring', icon: 'chart', course: 6 },
  { id: 'm-money', title: 'money', sub: 'Decimal, parse_amount', icon: 'card', course: 4 },
]
export const NEXT: MapPart[] = [
  { id: 'n-model', title: 'classes', sub: 'Expense, Money, Store', icon: 'boxes', course: 8 },
  { id: 'n-trust', title: 'tests and logs', sub: 'pytest, mypy, logging', icon: 'shield', course: 9 },
  { id: 'n-connect', title: 'the network', sub: 'exchange rates, asyncio', icon: 'globe', course: 10 },
  { id: 'n-ship', title: 'ship it', sub: 'a package and a web API', icon: 'package', course: 11 },
]

const card = (p: MapPart, built: number): Item =>
  ({ type: 'item', id: p.id, title: `${p.title} · course ${p.course}`, sub: p.sub, icon: p.icon, tone: p.course <= built ? 'store' : 'neutral' })

export function appMap({ title, sub, built, output }: { title: string; sub: string; built: number; output?: SceneNode }): SceneModel {
  const inputs: Group = {
    type: 'group', id: 'inputs', title: 'In', icon: 'file', tone: 'source', children: [
      { type: 'item', id: 'in-bank', title: 'data/bank/*.csv', sub: 'two months, two encodings', icon: 'file' },
      { type: 'item', id: 'in-ana', title: 'Ana', sub: 'python -m expense_tracker …', icon: 'user' },
    ],
  }
  const pkg: Group = {
    type: 'group', id: 'pkg', title: 'expense_tracker', sub: 'the package', icon: 'python', tone: 'ingest', dir: 'grid', cols: 2,
    children: PARTS.map((p) => card(p, built)),
  }
  const outputs: Group = {
    type: 'group', id: 'outputs', title: 'Out', icon: 'screen', tone: 'store', children: output ? [output] : [
      { type: 'item', id: 'out-report', title: 'the monthly report', sub: 'spent, budget, used', icon: 'chart' },
      { type: 'item', id: 'out-bills', title: 'recurring bills', icon: 'clock' },
      { type: 'item', id: 'out-json', title: 'data/expenses.json', sub: 'every expense, saved', icon: 'database' },
    ],
  }
  const next: Group = {
    type: 'group', id: 'next', title: built >= 11 ? 'Made professional' : 'Still to come', icon: 'layers', tone: built >= 11 ? 'store' : 'neutral', dir: 'row',
    children: NEXT.map((p) => card(p, built)),
  }
  return {
    title, sub,
    nodes: [{ type: 'group', id: 'flow', bare: true, dir: 'row', children: [inputs, pkg, outputs] }, next],
    edges: [{ from: 'inputs', to: 'pkg', label: 'read' }, { from: 'pkg', to: 'outputs', label: 'write' }],
  }
}
