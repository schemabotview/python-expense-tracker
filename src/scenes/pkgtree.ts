import type { TreeEntry } from '@graphlearning/graphl-flow'
import { venvClosed } from './start/tree'

// The explorer from Course 8 on: data/, the expense_tracker package (its modules listed), the shim.
// `active` is the file in the editor; `fresh` marks files the step adds.
export function pkgTree(modules: string[], active: string, fresh: string[] = [], extra: TreeEntry[] = [], tests: string[] = []): TreeEntry[] {
  const entry = (name: string): TreeEntry => ({ name, state: name === active ? 'active' : fresh.includes(name) ? 'new' : undefined })
  return [
    venvClosed,
    { name: 'data', children: [{ name: 'bank', folder: true }, { name: 'expenses.json' }] },
    { name: 'expense_tracker', children: modules.map(entry) },
    ...(tests.length ? [{ name: 'tests', children: tests.map(entry) }] : []),
    ...extra,
    { name: 'main.py', state: 'muted' },
  ]
}
