import { ACTION, COPPER, ESTATE, SILVER } from '@/tactic'
import { splitByDraw, splitByNoDraw } from '@/util/splitToHandsUtil'

describe('splitWithoutNoDraw', () => {
  it('splits sorted 5 cards hand', () => {
    const deck = [ESTATE, COPPER, ACTION, COPPER, ESTATE, COPPER, COPPER, SILVER, COPPER, COPPER, COPPER, ESTATE]
    expect(splitByNoDraw(deck)).toEqual([
      [ACTION, COPPER, COPPER, ESTATE, ESTATE],
      [COPPER, COPPER, COPPER, COPPER, SILVER],
    ])
  })
})

describe('splitWithDraw', () => {
  it.each([
    [
      'when +2 card is in first 5 cards, split with 7 and 5 hands',
      [ESTATE, COPPER, ACTION, COPPER, ESTATE, COPPER, COPPER, SILVER, COPPER, COPPER, COPPER, ESTATE],
      [
        [ACTION, COPPER, COPPER, COPPER, COPPER, ESTATE, ESTATE],
        [COPPER, COPPER, COPPER, ESTATE, SILVER],
      ],
    ],
    [
      'when +2 card is in ssecond 5 cards, split with 5 and 7 hands',
      [ESTATE, COPPER, COPPER, ESTATE, COPPER, COPPER, SILVER, COPPER, ACTION, COPPER, COPPER, ESTATE],
      [
        [COPPER, COPPER, COPPER, ESTATE, ESTATE],
        [ACTION, COPPER, COPPER, COPPER, COPPER, ESTATE, SILVER],
      ],
    ],
    [
      'when +2 card is in last 2 card',
      [ESTATE, COPPER, COPPER, ESTATE, COPPER, COPPER, SILVER, COPPER, COPPER, COPPER, ACTION, ESTATE],
      [
        [COPPER, COPPER, COPPER, ESTATE, ESTATE],
        [COPPER, COPPER, COPPER, COPPER, SILVER],
      ],
    ],
  ])('%s', (_, deck, expected) => {
    expect(splitByDraw(deck, 2)).toEqual(expected)
  })
})
