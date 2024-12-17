interface Cell {
  id: string
  value: number
  posX: number
  posY: number
  isMerge?: boolean
}

type Row = Cell[]

type Table = Row[]
