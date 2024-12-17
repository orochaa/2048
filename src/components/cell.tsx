import React, { useEffect, useState } from 'react'

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

export function Cell(props: Omit<Cell, 'id'>): React.JSX.Element {
  const { value, posX, posY, isMerge } = props

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isMerge) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 200)

      return (): void => {
        clearTimeout(timer)
        setIsAnimating(false)
      }
    }
  }, [isMerge])

  return (
    <div
      className="absolute left-0 top-0 flex size-24 flex-col items-center justify-center rounded-lg text-3xl font-medium text-brown-600 transition-transform will-change-transform"
      style={{
        transform: `translate(${104 * posX + 8}px, ${104 * posY + 8}px) scale(${isAnimating ? 1.1 : 1})`,
        backgroundColor: cellColors[value],
      }}
    >
      {/* <span className="text-xs">{cell.id}</span> */}
      <span>{value === 0 ? '' : value}</span>
      {/* <span>
        {posY}|{posX}
      </span> */}
    </div>
  )
}
