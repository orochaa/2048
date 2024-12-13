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

export function generateCell(value: number = 0): Cell {
  return { id: nanoid(), value }
}

export function copyCell(cell: Cell, value?: number): Cell {
  return { ...cell, value: value ?? cell.value }
}

export function generateTable(size: number): Table {
  return Array.from<Row>({ length: size }).map(() =>
    Array.from<Cell>({ length: size }).map(() => ({
      id: nanoid(),
      value: 0,
    }))
  )
}

export function isCellEqual(a: Cell, b: Cell): boolean {
  return a.value > 0 && b.value > 0 && a.value === b.value
}
