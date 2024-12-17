import type { Dispatch, SetStateAction } from 'react'
import {
  compareCells,
  compareTables,
  copyCell,
  generateCell,
  generateTable,
  generateValue,
  getRandomValue,
  getRandomValueBetween,
} from './utils'

export function addRandomCell(table: Table): Table {
  const emptyCells = table.flat().filter(cell => cell.value === 0)
  const randomEmptyCell = getRandomValue(emptyCells)

  return table.map(row =>
    row.map(cell =>
      cell.id === randomEmptyCell.id
        ? copyCell(cell, { value: generateValue() })
        : cell
    )
  )
}

function sum(row: Cell[], direction: Direction): Cell[] {
  const newRow: Cell[] = []
  const isReversed = direction === 'end'
  const workingRow = isReversed ? [...row].reverse() : row

  for (let i = 0; i < workingRow.length; i++) {
    const currentCell = workingRow[i]
    const isLastCell = i + 1 === workingRow.length

    if (isLastCell) {
      newRow.push(copyCell(currentCell, { isMerge: false }))
      break
    }

    const nextCell = workingRow[i + 1]

    if (compareCells(currentCell, nextCell)) {
      newRow.push(
        copyCell(nextCell, {
          value: currentCell.value * 2,
          isMerge: true,
        })
      )
      i++

      continue
    }

    newRow.push(copyCell(currentCell, { isMerge: false }))
  }

  return isReversed ? newRow.reverse() : newRow
}

export function move(table: Table, mode: Mode, direction: Direction): Table {
  const tableSize = table.length
  const newTable: Table = Array.from({ length: tableSize }).map(() =>
    Array.from({ length: tableSize })
  )

  for (let i = 0; i < tableSize; i++) {
    const row = mode === 'row' ? table[i] : table.map(row => row[i])
    const filteredRow = row.filter(cell => cell.value > 0)
    const newRow = sum(filteredRow, direction)
    const missingLength = tableSize - newRow.length

    for (let j = 0; j < missingLength; j++) {
      ;(direction === 'end' ? newRow.unshift : newRow.push).bind(newRow)(
        generateCell(0)
      )
    }

    for (const [j, newCell] of newRow.entries()) {
      if (mode === 'col') {
        newTable[j][i] = newCell
        newTable[j][i].posY = j
        newTable[j][i].posX = i
      } else {
        newTable[i][j] = newCell
        newTable[i][j].posY = i
        newTable[i][j].posX = j
      }
    }
  }

  return newTable
}

interface ActionsParams {
  setTable: Dispatch<SetStateAction<Table>>
  setMoveCounter: Dispatch<SetStateAction<number>>
  tableSize: number
}

interface Actions {
  startGame: () => void
  moveDown: () => void
  moveUp: () => void
  moveLeft: () => void
  moveRight: () => void
}

export function generateActions(params: ActionsParams): Actions {
  const { setTable, setMoveCounter, tableSize } = params

  return {
    startGame: (): void => {
      const newTable = generateTable(tableSize)
      const startRow = getRandomValueBetween(0, tableSize - 1)
      const startCol = getRandomValueBetween(0, tableSize - 1)
      const startValue = generateValue()
      newTable[startRow][startCol] = generateCell(startValue)
      newTable[startRow][startCol].posY = startRow
      newTable[startRow][startCol].posX = startCol
      setTable(newTable)
      setMoveCounter(1)
    },
    moveUp: (): void => {
      setTable(table => {
        const newTable = move(table, 'col', 'start')

        if (compareTables(table, newTable)) {
          return table
        }
        const newTableWithNewCell = addRandomCell(newTable)
        setMoveCounter(state => state + 1)

        return newTableWithNewCell
      })
    },
    moveDown: (): void => {
      setTable(table => {
        const newTable = move(table, 'col', 'end')

        if (compareTables(table, newTable)) {
          return table
        }

        const newTableWithNewCell = addRandomCell(newTable)
        setMoveCounter(state => state + 1)

        return newTableWithNewCell
      })
    },
    moveLeft: (): void => {
      setTable(table => {
        const newTable = move(table, 'row', 'start')

        if (compareTables(table, newTable)) {
          return table
        }

        const newTableWithNewCell = addRandomCell(newTable)
        setMoveCounter(state => state + 1)

        return newTableWithNewCell
      })
    },
    moveRight: (): void => {
      setTable(table => {
        const newTable = move(table, 'row', 'end')

        if (compareTables(table, newTable)) {
          return table
        }

        const newTableWithNewCell = addRandomCell(newTable)
        setMoveCounter(state => state + 1)

        return newTableWithNewCell
      })
    },
  }
}
