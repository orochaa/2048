import { useEffect, useState } from 'react'

export interface WindowSizeState {
  width: number
  height: number
}

export function useWindowSize(): WindowSizeState {
  const [windowSize, setWindowSize] = useState<WindowSizeState>({
    width: 1280,
    height: 720,
  })

  useEffect(() => {
    const handleResize = (): void => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}
