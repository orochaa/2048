import { nanoid } from 'nanoid'

export function getRandomValueBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomValue<T>(list: T[]): T {
  return list[getRandomValueBetween(0, list.length - 1)]
}

export function generateValue(): number {
  return Math.random() < 0.1 ? 4 : 2
}

export function generateCell(
  value: number,
  params?: Partial<Omit<Cell, 'id'>>
): Cell {
  return { id: nanoid(), value, posX: 0, posY: 0, ...params }
}

export function generateRow(
  size: number,
  rowIndex: number,
  params?: Partial<Omit<Cell, 'id'>>
): Row {
  return Array.from<Cell>({ length: size }).map((_, colIndex) => ({
    id: nanoid(),
    value: 0,
    posY: rowIndex,
    posX: colIndex,
    ...params,
  }))
}

export function generateTable(size: number): Table {
  return Array.from({ length: size }).map((_, rowIndex) =>
    generateRow(size, rowIndex)
  )
}

export function copyCell(cell: Cell, params: Partial<Omit<Cell, 'id'>>): Cell {
  return { ...cell, ...params }
}

export function isCellEqual(a: Cell, b: Cell): boolean {
  return a.value > 0 && b.value > 0 && a.value === b.value
}
