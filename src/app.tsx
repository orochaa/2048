import { useEffect, useMemo, useState } from 'react'
import { generateActions } from './actions'
import { generateTable } from './utils'

const tableSize = 4
const initialTable = generateTable(tableSize)

export function App(): React.JSX.Element {
  const [round, setRound] = useState<number>(1)
  const [table, setTable] = useState<Table>(initialTable)

  const actions = useMemo(
    () =>
      generateActions({
        setRound,
        setTable,
        tableSize,
      }),
    []
  )

  useEffect(() => {
    const handleMovement = (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'ArrowUp':
          actions.moveUp()
          break
        case 'ArrowDown':
          actions.moveDown()
          break
        case 'ArrowLeft':
          actions.moveLeft()
          break
        case 'ArrowRight':
          actions.moveRight()
          break
      }
    }

    document.addEventListener('keydown', handleMovement)

    return (): void => {
      document.removeEventListener('keydown', handleMovement)
    }
  }, [actions])

  useEffect(() => {
    actions.startGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-orange-400">
      <div>
        <div>Round {round}</div>
        <div>
          {/* eslint-disable-next-line react/jsx-handler-names */}
          <button type="button" onClick={actions.startGame}>
            Start
          </button>
        </div>
        <div
          className="grid grid-cols-4 gap-0.5 bg-zinc-200 p-0.5 shadow"
          style={{
            gridTemplateColumns: `repeat(${tableSize}, minmax(0, 1fr))`,
          }}
        >
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
