import { move } from './actions'
import { generateCell } from './utils'

const mapToTable = (table: number[][]): Table =>
  table.map(row => row.map(value => generateCell(value)))

const mapToValues = (table: Table): (number | undefined)[][] =>
  table.map(row => row.map(cell => cell.value))

describe('move', () => {
  it('should move all elements to given direction', () => {
    const testCases: {
      table: number[][]
      mode: Mode
      direction: Direction
      expected: number[][]
    }[] = [
      {
        table: [
          [0, 0, 0, 2],
          [0, 0, 2, 0],
          [0, 2, 0, 0],
          [2, 0, 0, 0],
        ],
        mode: 'col',
        direction: 'start',
        expected: [
          [2, 2, 2, 2],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        table: [
          [0, 0, 0, 2],
          [0, 0, 2, 0],
          [0, 2, 0, 0],
          [2, 0, 0, 0],
        ],
        mode: 'col',
        direction: 'end',
        expected: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [2, 2, 2, 2],
        ],
      },
      {
        table: [
          [0, 0, 0, 2],
          [0, 0, 2, 0],
          [0, 2, 0, 0],
          [2, 0, 0, 0],
        ],
        mode: 'row',
        direction: 'start',
        expected: [
          [2, 0, 0, 0],
          [2, 0, 0, 0],
          [2, 0, 0, 0],
          [2, 0, 0, 0],
        ],
      },
      {
        table: [
          [0, 0, 0, 2],
          [0, 0, 2, 0],
          [0, 2, 0, 0],
          [2, 0, 0, 0],
        ],
        mode: 'row',
        direction: 'end',
        expected: [
          [0, 0, 0, 2],
          [0, 0, 0, 2],
          [0, 0, 0, 2],
          [0, 0, 0, 2],
        ],
      },
    ]

    expect.assertions(testCases.length)

    for (const tc of testCases) {
      const table = mapToTable(tc.table)
      const result = move(table, tc.mode, tc.direction)
      const resultValues = mapToValues(result)

      expect(resultValues).toStrictEqual(tc.expected)
    }
  })

  it('should sum values', () => {
    const testCases: {
      table: number[][]
      mode: Mode
      direction: Direction
      expected: number[][]
    }[] = [
      {
        table: [
          [2, 0, 0, 0],
          [2, 2, 0, 0],
          [2, 0, 2, 0],
          [2, 0, 0, 2],
        ],
        mode: 'row',
        direction: 'start',
        expected: [
          [2, 0, 0, 0],
          [4, 0, 0, 0],
          [4, 0, 0, 0],
          [4, 0, 0, 0],
        ],
      },
      {
        table: [
          [2, 0, 0, 2],
          [0, 2, 0, 2],
          [0, 0, 2, 2],
          [0, 0, 0, 2],
        ],
        mode: 'row',
        direction: 'start',
        expected: [
          [4, 0, 0, 0],
          [4, 0, 0, 0],
          [4, 0, 0, 0],
          [2, 0, 0, 0],
        ],
      },
      {
        table: [
          [0, 0, 0, 2],
          [0, 0, 2, 2],
          [0, 2, 0, 2],
          [2, 0, 0, 2],
        ],
        mode: 'row',
        direction: 'end',
        expected: [
          [0, 0, 0, 2],
          [0, 0, 0, 4],
          [0, 0, 0, 4],
          [0, 0, 0, 4],
        ],
      },
      {
        table: [
          [2, 0, 0, 0],
          [2, 0, 2, 0],
          [2, 2, 0, 0],
          [2, 0, 0, 2],
        ],
        mode: 'row',
        direction: 'end',
        expected: [
          [0, 0, 0, 2],
          [0, 0, 0, 4],
          [0, 0, 0, 4],
          [0, 0, 0, 4],
        ],
      },
      {
        table: [
          [2, 2, 2, 2],
          [0, 2, 0, 0],
          [0, 0, 2, 0],
          [0, 0, 0, 2],
        ],
        mode: 'col',
        direction: 'start',
        expected: [
          [2, 4, 4, 4],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        table: [
          [2, 0, 0, 0],
          [0, 2, 0, 0],
          [0, 0, 2, 0],
          [2, 2, 2, 2],
        ],
        mode: 'col',
        direction: 'start',
        expected: [
          [4, 4, 4, 2],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        table: [
          [0, 0, 0, 2],
          [0, 0, 2, 0],
          [0, 2, 0, 0],
          [2, 2, 2, 2],
        ],
        mode: 'col',
        direction: 'end',
        expected: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [2, 4, 4, 4],
        ],
      },
      {
        table: [
          [2, 2, 2, 2],
          [0, 0, 2, 0],
          [0, 2, 0, 0],
          [2, 0, 0, 0],
        ],
        mode: 'col',
        direction: 'end',
        expected: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [4, 4, 4, 2],
        ],
      },
    ]

    expect.assertions(testCases.length)

    for (const tc of testCases) {
      const table = mapToTable(tc.table)
      const result = move(table, tc.mode, tc.direction)
      const resultValues = mapToValues(result)

      expect(
        resultValues,
        `\n${JSON.stringify({ mode: tc.mode, direction: tc.direction })}\n${JSON.stringify({ 'table   ': tc.table })}\n${JSON.stringify({ 'result  ': resultValues })}\n${JSON.stringify({ expected: tc.expected })}\n`
      ).toStrictEqual(tc.expected)
    }
  })

  it('should sum last values', () => {
    const testCases: {
      table: number[][]
      mode: Mode
      direction: Direction
      expected: number[][]
    }[] = [
      {
        table: [
          [2, 2, 0, 0],
          [2, 2, 2, 0],
          [2, 0, 2, 2],
          [2, 2, 2, 2],
        ],
        mode: 'row',
        direction: 'start',
        expected: [
          [4, 0, 0, 0],
          [4, 2, 0, 0],
          [4, 2, 0, 0],
          [4, 4, 0, 0],
        ],
      },
      {
        table: [
          [0, 0, 2, 2],
          [0, 2, 2, 2],
          [2, 2, 0, 2],
          [2, 2, 2, 2],
        ],
        mode: 'row',
        direction: 'start',
        expected: [
          [4, 0, 0, 0],
          [4, 2, 0, 0],
          [4, 2, 0, 0],
          [4, 4, 0, 0],
        ],
      },
      {
        table: [
          [0, 0, 2, 2],
          [0, 2, 2, 2],
          [2, 2, 0, 2],
          [2, 2, 2, 2],
        ],
        mode: 'row',
        direction: 'end',
        expected: [
          [0, 0, 0, 4],
          [0, 0, 2, 4],
          [0, 0, 2, 4],
          [0, 0, 4, 4],
        ],
      },
      {
        table: [
          [2, 2, 0, 0],
          [2, 2, 2, 0],
          [2, 0, 2, 2],
          [2, 2, 2, 2],
        ],
        mode: 'row',
        direction: 'end',
        expected: [
          [0, 0, 0, 4],
          [0, 0, 2, 4],
          [0, 0, 2, 4],
          [0, 0, 4, 4],
        ],
      },
      {
        table: [
          [2, 2, 2, 2],
          [2, 2, 0, 2],
          [0, 2, 2, 2],
          [0, 0, 2, 2],
        ],
        mode: 'col',
        direction: 'start',
        expected: [
          [4, 4, 4, 4],
          [0, 2, 2, 4],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        table: [
          [0, 0, 2, 2],
          [0, 2, 2, 2],
          [2, 2, 0, 2],
          [2, 2, 2, 2],
        ],
        mode: 'col',
        direction: 'start',
        expected: [
          [4, 4, 4, 4],
          [0, 2, 2, 4],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        table: [
          [0, 0, 2, 2],
          [0, 2, 2, 2],
          [2, 2, 0, 2],
          [2, 2, 2, 2],
        ],
        mode: 'col',
        direction: 'end',
        expected: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 2, 2, 4],
          [4, 4, 4, 4],
        ],
      },
      {
        table: [
          [2, 2, 2, 2],
          [2, 2, 2, 2],
          [0, 2, 0, 2],
          [0, 0, 2, 2],
        ],
        mode: 'col',
        direction: 'end',
        expected: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 2, 2, 4],
          [4, 4, 4, 4],
        ],
      },
    ]

    expect.assertions(testCases.length)

    for (const tc of testCases) {
      const table = mapToTable(tc.table)
      const result = move(table, tc.mode, tc.direction)
      const resultValues = mapToValues(result)

      expect(
        resultValues,
        `\n${JSON.stringify({ mode: tc.mode, direction: tc.direction })}\n${JSON.stringify({ 'table   ': tc.table })}\n${JSON.stringify({ 'result  ': resultValues })}\n${JSON.stringify({ expected: tc.expected })}\n`
      ).toStrictEqual(tc.expected)
    }
  })
})
