interface Cell {
  id: string
  value: number
}

type Row = Cell[]

type Table = Row[]

interface Position {
  row: number
  col: number
}
