import type { Table, TableRow } from '@graphlearning/graphl-flow'

// Memory-diagram pieces (ported from python-ct): a names table (each row a name with a ● that an
// edge leaves from) and object tables. An object a name refers to as a WHOLE is drawn as ONE row, so
// arrows meet the object, not one of its elements.
export const names = (id: string, rows: string[], title = 'names'): Table =>
  ({ type: 'table', id, title, rows: rows.map((n): TableRow => ({ cells: [n, '●'] })) })

export const obj = (id: string, title: string, rows: ((string | number)[] | TableRow)[], tone?: Table['tone']): Table =>
  ({ type: 'table', id, title, tone, rows })
