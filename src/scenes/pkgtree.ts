import type { TreeEntry } from '@graphlearning/graphl-flow'

// The explorer from Course 8 on (IDE frame v2's compact explorer: the venv one muted folder): data/, the expense_tracker package (its modules listed), the shim.
// `active` is the file in the editor; `fresh` marks files the step adds.
export function pkgTree(modules: string[], active: string, fresh: string[] = [], extra: TreeEntry[] = [], tests: string[] = []): TreeEntry[] {
  const entry = (name: string): TreeEntry => ({ name, state: name === active ? 'active' : fresh.includes(name) ? 'new' : undefined })
  return [
    { name: '.venv', folder: true, state: 'muted' },
    { name: 'data', children: [{ name: 'bank', folder: true }, { name: 'expenses.json' }] },
    { name: 'expense_tracker', children: modules.map(entry) },
    ...(tests.length ? [{ name: 'tests', children: tests.map(entry) }] : []),
    ...extra,
    { name: 'main.py', state: 'muted' },
  ]
}

/** Close every folder that holds nothing active or new: the explorer shows only where the step works. */
export function folded(tree: TreeEntry[]): TreeEntry[] {
  const live = (e: TreeEntry): boolean => e.state === 'active' || e.state === 'new' || (e.children ?? []).some(live)
  return tree.map((e) => (e.children && !live(e) ? { name: e.name, folder: true, state: e.state } : e.children ? { ...e, children: folded(e.children) } : e))
}
