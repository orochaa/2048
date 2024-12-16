import { useEffect, useMemo, useState } from 'react'
import { MdRestartAlt } from 'react-icons/md'
import { addRandomCell, generateActions } from './actions'
import { generateTable } from './utils'

const tableSize = 4
const initialTable = addRandomCell(generateTable(tableSize))

const cellColors: Record<number, string> = {
  0: '#FCFCFC',
  2: '#50FFB5',
  4: '#83FF6A',
  8: '#60E0E0',
  16: '#44FF92',
  32: '#FF9494',
  64: '#FF7986',
  128: '#FF6663',
  256: '#FF66C4',
  512: '#FF8FFF',
  1024: '#B78FFF',
  2048: '#DA79FF',
}

export function App(): React.JSX.Element {
  const [moveCounter, setMoveCounter] = useState<number>(0)
  const [table, setTable] = useState<Table>(initialTable)

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
          className="mt-4 grid grid-cols-4 gap-2 rounded-lg bg-brown-500 p-2 shadow"
          style={{
            gridTemplateColumns: `repeat(${tableSize}, minmax(0, 1fr))`,
          }}
        >
          {table.flatMap(row =>
            row.map(cell => (
              <div
                key={cell.id}
                className="flex size-24 flex-col items-center justify-center rounded-lg text-3xl font-medium text-brown-600"
                style={{ backgroundColor: cellColors[cell.value] }}
              >
                {/* <span className="text-xs">{cell.id}</span> */}
                <span>{cell.value === 0 ? '' : cell.value}</span>
              </div>
            ))
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
