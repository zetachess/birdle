import { generateEmojiGrid } from './share'

const mockSolutionGetter = jest.fn()
jest.mock('./words', () => ({
  ...jest.requireActual('./words'),
  get solution() {
    // TODO A try/catch block is needed here since `solution` may be referenced
    // during module import, triggering this getter before being completely
    // initialized. A refactor of `solution` might be a better approach.
    try {
      return mockSolutionGetter()
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e
      }
      return ''
    }
  },
}))

describe('generateEmojiGrid', () => {
  test('generates grid for ascii', () => {
    const guesses = ['EDCBA', 'VWXYZ', 'ABCDE']
    const tiles = ['C', 'P', 'A'] // Correct, Present, Absemt
    mockSolutionGetter.mockReturnValue('ABCDE')

    const grid = generateEmojiGrid(guesses, tiles)
    const gridParts = grid.split('\n')
    expect(gridParts[0]).toBe('PPCPP')
    expect(gridParts[1]).toBe('AAAAA')
    expect(gridParts[2]).toBe('CCCCC')
  })
  test('generates grid for ascii', () => {
    const guesses = ['5️⃣4️⃣3️⃣2️⃣1️⃣', '♠️♥️♦️♣️🔔', '1️⃣2️⃣3️⃣4️⃣5️⃣']
    const tiles = ['C', 'P', 'A'] // Correct, Present, Absemt
    mockSolutionGetter.mockReturnValue('1️⃣2️⃣3️⃣4️⃣5️⃣')

    const grid = generateEmojiGrid(guesses, tiles)
    const gridParts = grid.split('\n')
    expect(gridParts[0]).toBe('PPCPP')
    expect(gridParts[1]).toBe('AAAAA')
    expect(gridParts[2]).toBe('CCCCC')
  })
})
