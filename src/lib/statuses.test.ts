import { getStatuses, getGuessStatuses } from './statuses'

const mockSolutionGetter = jest.fn();
jest.mock('./words', () => ({
  ...jest.requireActual('./words'),
  get solution () {
    return mockSolutionGetter()
  }
}))

describe('getStatuses', () => {
  test('ascii characters', () => {
    mockSolutionGetter.mockReturnValue('BCDEA')
    const guesses = ['EDCBA', 'VWXYZ', 'ABCDE']

    const charStatuses = getStatuses(guesses)
    expect(charStatuses['A']).toBe('correct')
    expect(charStatuses['B']).toBe('present')
    expect(charStatuses['C']).toBe('present')
    expect(charStatuses['D']).toBe('present')
    expect(charStatuses['E']).toBe('present')
    expect(charStatuses['V']).toBe('absent')
    expect(charStatuses['W']).toBe('absent')
    expect(charStatuses['X']).toBe('absent')
    expect(charStatuses['Y']).toBe('absent')
    expect(charStatuses['Z']).toBe('absent')
  })

  test('unicode characters', () => {
    mockSolutionGetter.mockReturnValue('1️⃣2️⃣3️⃣4️⃣5️⃣')
    const guesses = ['1️⃣2️⃣3️⃣5️⃣4️⃣', 'ABCDE', '2️⃣1️⃣X5️⃣4️⃣']
    const charStatuses = getStatuses(guesses)
    expect(charStatuses['1️⃣']).toBe('correct')
    expect(charStatuses['2️⃣']).toBe('correct')
    expect(charStatuses['3️⃣']).toBe('correct')
    expect(charStatuses['4️⃣']).toBe('present')
    expect(charStatuses['5️⃣']).toBe('present')
    expect(charStatuses['A']).toBe('absent')
    expect(charStatuses['B']).toBe('absent')
    expect(charStatuses['C']).toBe('absent')
    expect(charStatuses['D']).toBe('absent')
    expect(charStatuses['E']).toBe('absent')
    expect(charStatuses['X']).toBe('absent')
  })
})


describe('getGuessStatuses', () => {
  test('ascii characters', () => {
    mockSolutionGetter.mockReturnValue('ABCDE')
    expect(getGuessStatuses('EDCBA')).toStrictEqual(
      ['present', 'present', 'correct', 'present', 'present'])
    expect(getGuessStatuses('ABCDE')).toStrictEqual(
      ['correct', 'correct', 'correct', 'correct', 'correct'])
    expect(getGuessStatuses('WXYZA')).toStrictEqual(
      ['absent', 'absent', 'absent', 'absent', 'present'])
  })

  test('unicode characters', () => {
    mockSolutionGetter.mockReturnValue('1️⃣2️⃣3️⃣4️⃣5️⃣')
    expect(getGuessStatuses('5️⃣4️⃣3️⃣2️⃣1️⃣')).toStrictEqual(
      ['present', 'present', 'correct', 'present', 'present'])
    expect(getGuessStatuses('1️⃣2️⃣3️⃣4️⃣5️⃣')).toStrictEqual(
      ['correct', 'correct', 'correct', 'correct', 'correct'])
    expect(getGuessStatuses('WXYZ1️⃣')).toStrictEqual(
      ['absent', 'absent', 'absent', 'absent', 'present'])
  })
})
