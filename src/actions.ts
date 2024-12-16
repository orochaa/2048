import type { Dispatch, SetStateAction } from 'react'
import {
  copyCell,
  generateCell,
  generateTable,
  generateValue,
  getRandomValue,
  getRandomValueBetween,
  isCellEqual,
} from './utils'

function addRandomCell(table: Table): Table {
  const emptyCells = table.flat().filter(cell => cell.value === 0)
  const randomEmptyCell = getRandomValue(emptyCells)

  return table.map(row =>
    row.map(cell =>
      cell.id === randomEmptyCell.id ? copyCell(cell, generateValue()) : cell
    )
  )
}

function sum(row: Row): Row {
  const newRow: Row = []

  for (let i = 0; i < row.length; i++) {
    const currentCell = row[i]
    const isLastCell = i + 1 >= row.length

    if (isLastCell) {
      newRow.push(currentCell)
      break
    }

    const nextCell = row[i + 1]

    if (isCellEqual(currentCell, nextCell)) {
      newRow.push(copyCell(currentCell, currentCell.value * 2))
      i++

      continue
    }

    newRow.push(currentCell)
  }

  return newRow
}

function move(
  table: Table,
  mode: 'col' | 'row',
  direction: 'start' | 'end'
): Table {
  const tableSize = table.length
  const newTable: Table = Array.from<Row>({ length: tableSize }).map(() =>
    Array.from<Cell>({ length: tableSize })
  )

  for (let i = 0; i < tableSize; i++) {
    const row = mode === 'row' ? table[i] : table.map(row => row[i])
    const filteredRow = row.filter(cell => cell.value > 0)
    const newRow = sum(filteredRow)
    const missingLength = tableSize - newRow.length

    for (let j = 0; j < missingLength; j++) {
      ;(direction === 'end' ? newRow.unshift : newRow.push).bind(newRow)(
        generateCell(0)
      )
    }

    for (let j = 0; j < tableSize; j++) {
      if (mode === 'col') {
        newTable[j][i] = newRow[j]
      } else {
        newTable[i][j] = newRow[j]
      }
    }
  }

  return newTable
}

interface ActionsParams {
  setTable: Dispatch<SetStateAction<Table>>
  setRound: Dispatch<SetStateAction<number>>
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
  const { setTable, setRound, tableSize } = params

  return {
    startGame: (): void => {
      const newTable = generateTable(tableSize)
      const startRow = getRandomValueBetween(0, tableSize - 1)
      const startCol = getRandomValueBetween(0, tableSize - 1)
      const startValue = generateValue()
      newTable[startRow][startCol] = generateCell(startValue)
      setTable(newTable)
      setRound(1)
    },
    moveUp: (): void => {
      setRound(state => state + 1)
      setTable(table => {
        const newTable = move(table, 'col', 'start')
        const newTableWithNewCell = addRandomCell(newTable)

        return newTableWithNewCell
      })
    },
    moveDown: (): void => {
      setRound(state => state + 1)
      setTable(table => {
        const newTable = move(table, 'col', 'end')
        const newTableWithNewCell = addRandomCell(newTable)

        return newTableWithNewCell
      })
    },
    moveLeft: (): void => {
      setRound(state => state + 1)
      setTable(table => {
        const newTable = move(table, 'row', 'start')
        const newTableWithNewCell = addRandomCell(newTable)

        return newTableWithNewCell
      })
    },
    moveRight: (): void => {
      setRound(state => state + 1)
      setTable(table => {
        const newTable = move(table, 'row', 'end')
        const newTableWithNewCell = addRandomCell(newTable)

        return newTableWithNewCell
      })
    },
  }
}
