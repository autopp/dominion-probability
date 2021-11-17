import { Card, COPPER, ESTATE, SILVER } from '@/tactic'
import { genDecksWithDouble, withCombinationOfEstates } from '@/util/genDeckUtil'
import 'jest-extended'

describe('withCombinationOfEstates()', () => {
  it('with 2 argument, generates given size decks each contains 3 estate', () => {
    const actual = withCombinationOfEstates(4, (factory) => [factory.create((deck) => deck)])

    expect(actual).toIncludeSameMembers([
      [COPPER, ESTATE, ESTATE, ESTATE],
      [ESTATE, COPPER, ESTATE, ESTATE],
      [ESTATE, ESTATE, COPPER, ESTATE],
      [ESTATE, ESTATE, ESTATE, COPPER],
    ])
  })
})

describe('genDecksWithDouble()', () => {
  it('generates given size decks each contains 3 estate', () => {
    const actual = genDecksWithDouble(SILVER)

    expect(actual).toSatisfyAll(
      (deck: Card[]) =>
        deck.length === 12 &&
        deck.filter((card) => card === COPPER).length === 7 &&
        deck.filter((card) => card === ESTATE).length === 3 &&
        deck.filter((card) => card === SILVER).length === 2
    )
  })
})
