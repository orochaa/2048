import { useCallback, useEffect, useMemo, useState } from 'react'
import { LuGrid2X2Plus } from 'react-icons/lu'
import { MdRestartAlt } from 'react-icons/md'
import { addRandomCell, generateActions } from './actions'
import { Cell } from './components/cell'
import { Modal, useModal } from './components/modal'
import { generateTable } from './utils'

export function App(): React.JSX.Element {
  const [moveCounter, setMoveCounter] = useState<number>(0)
  const [table, setTable] = useState<Table>([])
  const [tableSize, setTableSize] = useState<number>(4)

  const backdrop = useMemo(() => generateTable(tableSize), [tableSize])

  const actions = useMemo(
    () =>
      generateActions({
        setMoveCounter,
        setTable,
        tableSize,
      }),
    [tableSize]
  )

  const selectSizeModal = useModal()

  const handleSelectTableSize = useCallback((size: number) => {
    setTable(addRandomCell(generateTable(size)))
    setTableSize(size)
  }, [])

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
  }, [actions])

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-orange-400 font-rubik">
      <div className="my-10">
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

        <div className="mx-auto mt-4 flex w-fit gap-2 rounded-lg bg-orange-300 p-1.5">
          <button
            type="button"
            title="Selecionar tamanho"
            className="flex items-center rounded-lg bg-neutral-100 p-2 text-zinc-600 hover:bg-neutral-200"
            onClick={() => selectSizeModal.current?.openModal()}
          >
            <LuGrid2X2Plus size={32} />
          </button>
          <button
            type="button"
            title="Reiniciar jogo"
            className="flex items-center rounded-lg bg-neutral-100 p-2 text-zinc-600 hover:bg-neutral-200"
            // eslint-disable-next-line react/jsx-handler-names
            onClick={actions.startGame}
          >
            <MdRestartAlt size={32} />
          </button>
        </div>
      </div>

      <Modal ref={selectSizeModal}>
        <h2 className="text-lg font-medium text-zinc-800">
          Selecionar tabuleiro:
        </h2>
        <div className="mt-2 grid min-w-80 grid-cols-2 items-start gap-4">
          {Array.from({ length: 4 }).map((_, i) => {
            const size = 3 + i

            return (
              <button
                key={size}
                type="button"
                title={`Selecionar tabuleiro ${size}x${size}`}
                className="transition duration-100 hover:scale-105"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => handleSelectTableSize(size)}
              >
                <span className="block text-center text-sm font-medium text-zinc-600">
                  {size}x{size}
                </span>
                <div
                  className="mx-auto grid w-fit gap-1 rounded-sm bg-brown-500 p-1"
                  style={{
                    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: size * size }).map((_, i) => (
                    <span key={i} className="size-3 rounded-sm bg-zinc-100" />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}
