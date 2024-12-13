import { useCallback, useEffect, useState } from 'react'
import {
  copyCell,
  generateCell,
  generateTable,
  generateValue,
  getRandomValue,
  getRandomValueBetween,
  isCellEqual,
} from './utils'

const tableSize = 4
const initialTable = generateTable(tableSize)

export function App(): React.JSX.Element {
  const [round, setRound] = useState<number>(1)
  const [table, setTable] = useState<Table>(initialTable)

  const startGame = useCallback(() => {
    const newTable = generateTable(tableSize)
    const startRow = getRandomValueBetween(0, tableSize - 1)
    const startCol = getRandomValueBetween(0, tableSize - 1)
    const startValue = generateValue()
    newTable[startRow][startCol] = generateCell(startValue)
    setTable(newTable)
    setRound(1)
  }, [])

  const moveDown = useCallback(() => {
    setRound(round => round + 1)
    setTable(table => {
      for (let colIndex = 0; colIndex < table.length; colIndex++) {
        const colCells = table
          .map(row => row[colIndex])
          .filter(cell => cell.value > 0)
        const newCells: Cell[] = []

        for (let i = 0; i < colCells.length; i++) {
          const currentCell = colCells[i]

          if (i + 1 >= colCells.length) {
            newCells.push(currentCell)
            break
          }

          const nextCell = colCells[i + 1]

          if (isCellEqual(currentCell, nextCell)) {
            newCells.push(copyCell(currentCell, currentCell.value * 2))
            i++

            continue
          }

          newCells.push(currentCell)
        }

        const missingCellsLength = table.length - newCells.length

        for (let i = 0; i < missingCellsLength; i++) {
          newCells.unshift(generateCell())
        }

        for (const [i, row] of table.entries()) {
          row[colIndex] = newCells[i]
        }
      }

      const emptyCells = table.flat().filter(cell => cell.value === 0)
      const randomEmptyCell = getRandomValue(emptyCells)

      return table.map(row =>
        row.map(cell =>
          cell.id === randomEmptyCell.id
            ? copyCell(cell, generateValue())
            : cell
        )
      )
    })
  }, [])

  useEffect(() => {
    const handleMovement = (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'ArrowDown':
          moveDown()
      }
    }

    document.addEventListener('keydown', handleMovement)

    return (): void => {
      document.removeEventListener('keydown', handleMovement)
    }
  }, [moveDown])

  useEffect(() => {
    startGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-orange-400">
      <div>
        <div>Round {round}</div>
        <div>
          <button type="button" onClick={startGame}>
            Start
          </button>
        </div>
        <div className="grid grid-cols-4 gap-0.5 bg-zinc-200 p-0.5 shadow">
          {table.flatMap(row =>
            row.map(cell => (
              <div
                key={cell.id}
                className="flex size-20 flex-col items-center justify-center rounded bg-white font-roboto text-4xl"
              >
                {/* <span className="text-xs">{cell.id}</span> */}
                <span>{cell.value === 0 ? '' : cell.value}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
