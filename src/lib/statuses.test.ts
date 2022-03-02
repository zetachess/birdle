import { NOT_CONTAINED_MESSAGE, WRONG_SPOT_MESSAGE } from '../constants/strings'
import {
  findFirstUnusedReveal,
  getStatuses,
  getGuessStatuses,
} from './statuses'

const mockSolutionGetter = jest.fn()
jest.mock('./words', () => ({
  ...jest.requireActual('./words'),
  get solution() {
    return mockSolutionGetter()
  },
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
    expect(getGuessStatuses('EDCBA')).toStrictEqual([
      'present',
      'present',
      'correct',
      'present',
      'present',
    ])
    expect(getGuessStatuses('ABCDE')).toStrictEqual([
      'correct',
      'correct',
      'correct',
      'correct',
      'correct',
    ])
    expect(getGuessStatuses('WXYZA')).toStrictEqual([
      'absent',
      'absent',
      'absent',
      'absent',
      'present',
    ])
  })

  test('unicode characters', () => {
    mockSolutionGetter.mockReturnValue('1️⃣2️⃣3️⃣4️⃣5️⃣')
    expect(getGuessStatuses('5️⃣4️⃣3️⃣2️⃣1️⃣')).toStrictEqual([
      'present',
      'present',
      'correct',
      'present',
      'present',
    ])
    expect(getGuessStatuses('1️⃣2️⃣3️⃣4️⃣5️⃣')).toStrictEqual([
      'correct',
      'correct',
      'correct',
      'correct',
      'correct',
    ])
    expect(getGuessStatuses('WXYZ1️⃣')).toStrictEqual([
      'absent',
      'absent',
      'absent',
      'absent',
      'present',
    ])
  })
})

describe('findFirstUnusedReveal', () => {
  test('returns false if there are no guesses', () => {
    const guesses: string[] = []
    expect(findFirstUnusedReveal('12345', guesses)).toBe(false)
  })

  test('returns false if the last guess was all absent', () => {
    mockSolutionGetter.mockReturnValue('ABCDE')
    const guesses: string[] = ['67890']
    expect(findFirstUnusedReveal('12345', guesses)).toBe(false)
  })

  test('returns warning for revealed correct ascii symbols', () => {
    mockSolutionGetter.mockReturnValue('ABCDE')
    const guesses: string[] = ['AXXXX']
    expect(findFirstUnusedReveal('XXXXX', guesses)).toBe(
      WRONG_SPOT_MESSAGE('A', 1)
    )
  })

  test('returns warning for revealed correct unicode symbols', () => {
    mockSolutionGetter.mockReturnValue('1️⃣2️⃣3️⃣4️⃣5️⃣')
    const guesses: string[] = ['1️⃣XXXXX']
    expect(findFirstUnusedReveal('XXXXX', guesses)).toBe(
      WRONG_SPOT_MESSAGE('1️⃣', 1)
    )
  })

  test('returns warning for revealed present ascii symbols', () => {
    mockSolutionGetter.mockReturnValue('ABCDE')
    const guesses: string[] = ['XAXXX']
    expect(findFirstUnusedReveal('XXXXX', guesses)).toBe(
      NOT_CONTAINED_MESSAGE('A')
    )
  })

  test('returns warning for revealed present unicode symbols', () => {
    mockSolutionGetter.mockReturnValue('1️⃣2️⃣3️⃣4️⃣5️⃣')
    const guesses: string[] = ['X1️⃣XXX']
    expect(findFirstUnusedReveal('XXXXX', guesses)).toBe(
      NOT_CONTAINED_MESSAGE('1️⃣')
    )
  })

  test('correctly handles 2 revealed present ascii symbols', () => {
    mockSolutionGetter.mockReturnValue('AABBB')
    const guesses: string[] = ['XXXAA']
    expect(findFirstUnusedReveal('XXXXX', guesses)).toBe(
      NOT_CONTAINED_MESSAGE('A')
    )
    expect(findFirstUnusedReveal('XXAXX', guesses)).toBe(
      NOT_CONTAINED_MESSAGE('A')
    )
    expect(findFirstUnusedReveal('XXAAX', guesses)).toBe(false)
  })

  test('correctly handles 2 revealed present unicode symbols', () => {
    mockSolutionGetter.mockReturnValue('1️⃣1️⃣2️⃣2️⃣2️⃣')
    const guesses: string[] = ['XXX1️⃣1️⃣']
    expect(findFirstUnusedReveal('XXXXX', guesses)).toBe(
      NOT_CONTAINED_MESSAGE('1️⃣')
    )
    expect(findFirstUnusedReveal('XX1️⃣XX', guesses)).toBe(
      NOT_CONTAINED_MESSAGE('1️⃣')
    )
    expect(findFirstUnusedReveal('XX1️⃣1️⃣X', guesses)).toBe(false)
  })

  test('correctly handles a mix of revealed present and correct ascii symbols', () => {
    mockSolutionGetter.mockReturnValue('AAABB')
    const guesses: string[] = ['AXXAA'] // 1 correct, 2 present
    expect(findFirstUnusedReveal('XXXAA', guesses)).toBe(
      WRONG_SPOT_MESSAGE('A', 1)
    )
    expect(findFirstUnusedReveal('AXAXX', guesses)).toBe(
      NOT_CONTAINED_MESSAGE('A')
    )
    expect(findFirstUnusedReveal('AXAAX', guesses)).toBe(false)
  })

  test('correctly handles a mix of revealed present and correct unicode symbols', () => {
    mockSolutionGetter.mockReturnValue('1️⃣1️⃣1️⃣2️⃣2️⃣')
    const guesses: string[] = ['1️⃣XX1️⃣1️⃣'] // 1 correct, 2 present
    expect(findFirstUnusedReveal('XXX1️⃣1️⃣', guesses)).toBe(
      WRONG_SPOT_MESSAGE('1️⃣', 1)
    )
    expect(findFirstUnusedReveal('1️⃣X1️⃣XX', guesses)).toBe(
      NOT_CONTAINED_MESSAGE('1️⃣')
    )
    expect(findFirstUnusedReveal('1️⃣X1️⃣1️⃣X', guesses)).toBe(false)
  })
})
