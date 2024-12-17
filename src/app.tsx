import { useEffect, useMemo, useState } from 'react'
import { MdRestartAlt } from 'react-icons/md'
import { addRandomCell, generateActions } from './actions'
import { Cell } from './cell'
import { generateTable } from './utils'

const tableSize = 4
const initialTable = addRandomCell(generateTable(tableSize))

export function App(): React.JSX.Element {
  const [moveCounter, setMoveCounter] = useState<number>(0)
  const [table, setTable] = useState<Table>(initialTable)

  const backdrop = useMemo(() => generateTable(tableSize), [])

  const actions = useMemo(
    () =>
      generateActions({
        setMoveCounter,
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

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-orange-400 font-rubik">
      <div>
        <div className="mx-auto grid w-fit grid-cols-2 gap-4">
          <div className="flex flex-col rounded-lg border-zinc-300 bg-white p-2 text-center shadow">
            <span className="text-lg">Movimentos</span>
            <span className="text-xl">{moveCounter}</span>
          </div>
          <div className="flex flex-col rounded-lg border-zinc-300 bg-white p-2 text-center shadow">
            <span className="text-lg">Recorde</span>
            <span className="text-xl">{moveCounter}</span>
          </div>
        </div>

        <div
          className="relative mt-4 rounded-lg bg-brown-500 shadow"
          style={{
            width: 104 * tableSize + 8,
            height: 104 * tableSize + 8,
          }}
        >
          {backdrop.flatMap((row, posY) =>
            row.map((cell, posX) => (
              <Cell key={cell.id} posX={posX} posY={posY} value={0} />
            ))
          )}
          {table.flatMap(row =>
            row.map(cell => <Cell key={cell.id} {...cell} />)
          )}
        </div>

        <button
          type="button"
          className="ml-auto mt-2 flex w-fit items-center gap-1 rounded-lg bg-neutral-100 p-2 text-zinc-600 hover:bg-neutral-200"
          // eslint-disable-next-line react/jsx-handler-names
          onClick={actions.startGame}
        >
          <MdRestartAlt size={20} />
          Reiniciar
        </button>
      </div>
    </div>
  )
}
