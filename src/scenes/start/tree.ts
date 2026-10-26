import type { TreeEntry } from '@graphlearning/graphl-flow'

// The explorer through Course 2. The venv's contents are shown once, in §1, as a 3.15.1 venv really
// lays them out (.gitignore, bin, include, lib, pyvenv.cfg); after that it is one muted folder.
export const venvOpen = (active?: string): TreeEntry => ({
  name: '.venv', state: 'new', children: [
    { name: '.gitignore' },
    { name: 'bin', folder: true },
    { name: 'include', folder: true },
    { name: 'lib', folder: true },
    { name: 'pyvenv.cfg', state: active === 'pyvenv.cfg' ? 'active' : undefined },
  ],
})

export const venvClosed: TreeEntry = { name: '.venv', folder: true, state: 'muted', note: "this project's Python" }

export const project = (main: 'new' | 'active'): TreeEntry[] => [
  venvClosed,
  { name: 'main.py', state: main === 'new' ? 'new' : 'active' },
]
