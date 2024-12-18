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

export function score(table: Table): number {
  return table.reduce(
    (rowAcc, row) =>
      rowAcc + row.reduce((cellAcc, cell) => cellAcc + cell.value, 0),
    0
  )
}

interface ActionsParams {
  setTable: Dispatch<SetStateAction<Table>>
  setMoveCounter: Dispatch<SetStateAction<number>>
  setScore: Dispatch<SetStateAction<number>>
  setBestScore: Dispatch<SetStateAction<number>>
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
  const { setTable, setMoveCounter, setScore, setBestScore, tableSize } = params

  const updateTable = (
    table: Table,
    mode: Mode,
    direction: Direction
  ): Table => {
    const newTable = move(table, mode, direction)

    if (compareTables(table, newTable)) {
      return table
    }

    const newTableWithNewCell = addRandomCell(newTable)
    const newScore = score(newTableWithNewCell)
    setMoveCounter(state => state + 1)
    setScore(newScore)
    setBestScore(bestScore => {
      if (newScore > bestScore) {
        localStorage.setItem('best-score', String(newScore))

        return newScore
      }

      return bestScore
    })

    return newTableWithNewCell
  }

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
      setMoveCounter(0)
      setScore(0)
    },
    moveUp: (): void => {
      setTable(table => updateTable(table, 'col', 'start'))
    },
    moveDown: (): void => {
      setTable(table => updateTable(table, 'col', 'end'))
    },
    moveLeft: (): void => {
      setTable(table => updateTable(table, 'row', 'start'))
    },
    moveRight: (): void => {
      setTable(table => updateTable(table, 'row', 'end'))
    },
  }
}
