import { useCallback, useEffect, useMemo, useState } from 'react'
import { FaQuestion } from 'react-icons/fa'
import { ImGithub } from 'react-icons/im'
import { LuGrid2X2Plus } from 'react-icons/lu'
import { MdRestartAlt } from 'react-icons/md'
import { addRandomCell, generateActions, move } from './actions'
import { Cell } from './components/cell'
import { Modal, useModal } from './components/modal'
import { useDailyAppPing } from './hooks/use-daily-app-ping'
import { useWindowSize } from './hooks/use-window-size'
import { compareTables, generateTable } from './utils'

const initialSize = 4
const initialTable = addRandomCell(generateTable(initialSize))

export function App(): React.JSX.Element {
  const [table, setTable] = useState<Table>(initialTable)
  const [tableSize, setTableSize] = useState<number>(initialSize)
  const [score, setScore] = useState<number>(0)
  const [bestScore, setBestScore] = useState<number>(0)
  const [moveCounter, setMoveCounter] = useState<number>(0)
  const [isInfinity, setIsInfinity] = useState<boolean>(false)

  const [touchStart, setTouchStart] = useState<{ x: number; y: number }>()
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number }>()

  const windowSize = useWindowSize()

  const backdrop = useMemo(() => generateTable(tableSize), [tableSize])

  const actions = useMemo(
    () =>
      generateActions({
        setMoveCounter,
        setScore,
        setBestScore,
        setTable,
        tableSize,
      }),
    [tableSize]
  )

  const selectSizeModal = useModal()
  const lostModal = useModal()
  const wonModal = useModal()
  const howToPlayModal = useModal()

  const handleOpenSelectSizeModal = useCallback(() => {
    selectSizeModal.current?.openModal()
  }, [selectSizeModal])

  const handleOpenHowToPlayModal = useCallback(() => {
    howToPlayModal.current?.openModal()
  }, [howToPlayModal])

  const handleCloseHowToPlayModal = useCallback(() => {
    howToPlayModal.current?.closeModal()
  }, [howToPlayModal])

  const handleSelectSize = useCallback((size: number) => {
    setTable(addRandomCell(generateTable(size)))
    setTableSize(size)
  }, [])

  const handleRestartGame = useCallback(() => {
    setIsInfinity(false)
    actions.startGame()
    lostModal.current?.closeModal()
    wonModal.current?.closeModal()
  }, [actions, lostModal, wonModal])

  const handleContinueGame = useCallback(() => {
    wonModal.current?.closeModal()
    setIsInfinity(true)
  }, [wonModal])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0]
      setTouchStart({ x: touch.clientX, y: touch.clientY })
    },
    []
  )

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })
  }, [])

  useEffect(() => {
    if (touchStart && touchEnd) {
      const deltaX = touchEnd.x - touchStart.x
      const deltaY = touchEnd.y - touchStart.y

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          actions.moveRight()
        } else {
          actions.moveLeft()
        }
      } else {
        if (deltaY > 0) {
          actions.moveDown()
        } else {
          actions.moveUp()
        }
      }

      setTouchStart(undefined)
      setTouchEnd(undefined)
    }
  }, [touchStart, touchEnd, actions])

  useEffect(() => {
    const handleMovement = (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault()
          actions.moveUp()
          break
        case 'ArrowDown':
        case 's':
          e.preventDefault()
          actions.moveDown()
          break
        case 'ArrowLeft':
        case 'a':
          e.preventDefault()
          actions.moveLeft()
          break
        case 'ArrowRight':
        case 'd':
          e.preventDefault()
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
    const possibleMoves: [Mode, Direction][] = [
      ['col', 'start'],
      ['col', 'end'],
      ['row', 'start'],
      ['row', 'end'],
    ]
    const isLost = possibleMoves.every(([mode, direction]) =>
      compareTables(table, move(table, mode, direction))
    )

    if (isLost) {
      lostModal.current?.openModal()
    }
  }, [lostModal, table])

  useEffect(() => {
    if (isInfinity) {
      return
    }

    const isWin = table.some(row => row.some(cell => cell.value === 2048))

    if (isWin) {
      wonModal.current?.openModal()
    }
  }, [isInfinity, table, wonModal])

  useEffect(() => {
    const savedBestScore = localStorage.getItem('best-score')

    if (savedBestScore) {
      setBestScore(Number(savedBestScore))
    }
  }, [])

  useDailyAppPing()

  return (
    <div className="font-rubik flex min-h-screen w-screen items-center justify-center bg-orange-400">
      <div className="mx-auto my-10 w-11/12">
        <h1 className="text-center text-7xl font-semibold text-stone-600 drop-shadow-sm">
          2048
        </h1>

        <div className="relative mx-auto mt-4 flex w-fit flex-col gap-4">
          <div className="mx-auto flex flex-wrap justify-center gap-3 md:absolute md:top-0 md:-right-44 md:flex-col">
            <div className="flex flex-col rounded-lg border-4 border-stone-600 bg-[#fcfcfc] p-2 text-center drop-shadow-sm">
              <span className="text-sm md:text-lg">Pontuação</span>
              <span className="text-md md:text-xl">{score}</span>
            </div>
            <div className="flex flex-col rounded-lg border-4 border-stone-600 bg-[#fcfcfc] p-2 text-center drop-shadow-sm">
              <span className="text-sm md:text-lg">Maior Pontuação</span>
              <span className="text-md md:text-xl">{bestScore}</span>
            </div>
            <div className="flex flex-col rounded-lg border-4 border-stone-600 bg-[#fcfcfc] p-2 text-center drop-shadow-sm">
              <span className="text-sm md:text-lg">Movimentos</span>
              <span className="text-md md:text-xl">{moveCounter}</span>
            </div>
            <div className="flex items-stretch justify-evenly gap-2 rounded-lg bg-orange-300 p-2 drop-shadow-sm">
              <a
                href="https://github.com/orochaa/2048"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-lg bg-neutral-100 p-2 text-zinc-600 hover:bg-neutral-200"
                title="Abrir repositório no GitHub"
              >
                <ImGithub size={28} className="text-zinc-800" />
              </a>
              <button
                type="button"
                className="flex items-center rounded-lg bg-neutral-100 p-2 text-zinc-600 hover:bg-neutral-200"
                onClick={handleOpenHowToPlayModal}
                title="Como jogar?"
              >
                <FaQuestion size={24} className="text-zinc-800" />
              </button>
            </div>
          </div>

          <div
            className="bg-brown-500 relative mx-auto rounded-lg shadow-sm"
            style={{
              width: (windowSize.width < 768 ? 72 : 104) * tableSize + 8,
              height: (windowSize.width < 768 ? 72 : 104) * tableSize + 8,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {backdrop.flatMap((row, posY) =>
              row.map((cell, posX) => (
                <Cell
                  key={cell.id}
                  posX={posX}
                  posY={posY}
                  value={0}
                  windowSize={windowSize}
                />
              ))
            )}
            {table.flatMap(row =>
              row.map(cell => (
                <Cell key={cell.id} {...cell} windowSize={windowSize} />
              ))
            )}
          </div>

          <div className="mx-auto flex w-fit gap-2 rounded-lg bg-orange-300 p-1.5 drop-shadow-sm">
            <button
              type="button"
              title="Escolher tabuleiro"
              className="rounded-lg bg-neutral-100 p-2 text-zinc-600 hover:bg-neutral-200"
              onClick={handleOpenSelectSizeModal}
            >
              <LuGrid2X2Plus size={32} />
            </button>
            <button
              type="button"
              title="Reiniciar jogo"
              className="rounded-lg bg-neutral-100 p-2 text-zinc-600 hover:bg-neutral-200"
              onClick={handleRestartGame}
            >
              <MdRestartAlt size={32} />
            </button>
          </div>
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
                onClick={() => handleSelectSize(size)}
              >
                <span className="block text-center text-sm font-medium text-zinc-600">
                  {size}x{size}
                </span>
                <div
                  className="bg-brown-500 mx-auto grid w-fit gap-1 rounded-xs p-1"
                  style={{
                    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: size * size }).map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <span key={i} className="size-3 rounded-xs bg-zinc-100" />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </Modal>

      <Modal ref={lostModal}>
        <h2 className="text-center text-lg font-medium text-zinc-800">
          Fim de jogo
        </h2>
        <p className="mt-1 max-w-72 text-center">
          O jogo chegou ao fim porque não há mais movimentos possíveis para
          combinar os blocos e criar um novo espaço vazio no tabuleiro.
        </p>
        <button
          type="button"
          className="mx-auto mt-4 block rounded-sm bg-neutral-200 p-2 hover:bg-neutral-300"
          onClick={handleRestartGame}
        >
          Tentar Novamente
        </button>
      </Modal>

      <Modal ref={wonModal} hideCloseButton>
        <h2 className="text-center text-lg font-medium text-zinc-800">
          Vitória
        </h2>
        <p className="mt-1 max-w-72 text-center">
          Parabéns! Você alcançou o objetivo do jogo, criando um bloco com o
          valor de 2048. Você deseja jogar novamente ou continuar?
        </p>
        <button
          type="button"
          className="mt-4 block w-full rounded-sm bg-neutral-200 p-2 hover:bg-neutral-300"
          onClick={handleRestartGame}
        >
          Jogar Novamente
        </button>
        <button
          type="button"
          className="mt-2 block w-full rounded-sm bg-neutral-200 p-2 hover:bg-neutral-300"
          onClick={handleContinueGame}
        >
          Continuar
        </button>
      </Modal>

      <Modal ref={howToPlayModal}>
        <h2 className="text-center text-lg font-medium text-zinc-800">
          Como jogar?
        </h2>
        <div className="mt-1 flex max-w-96 flex-col gap-2 text-pretty">
          <p className="">
            O jogo 2048 é um jogo de quebra-cabeça simples, mas desafiador. Veja
            abaixo como jogar:
          </p>
          <p>
            <span className="font-semibold text-zinc-600">Objetivo:</span> O
            objetivo do jogo é combinar blocos com números até formar um bloco
            com o valor de 2048.
          </p>
          <p>
            <span className="font-semibold text-zinc-600">Ações:</span> Para
            jogar, use as teclas de seta do teclado para mover os blocos para
            cima, para baixo, para a esquerda ou para a direita. Quando dois
            blocos com o mesmo número se encontram, eles se somam e formam um
            novo bloco. Continue movendo os blocos e combinando-os para criar
            blocos maiores e maiores até alcançar o objetivo de 2048.
          </p>
          <p>
            <span className="font-semibold text-zinc-600">Fim de jogo:</span> Se
            você ficar sem movimentos possíveis, o jogo terminará. Boa sorte!
          </p>
        </div>
        <button
          type="button"
          className="mt-4 block w-full rounded-sm bg-neutral-200 p-2 hover:bg-neutral-300"
          onClick={handleCloseHowToPlayModal}
        >
          Continuar
        </button>
      </Modal>
    </div>
  )
}
