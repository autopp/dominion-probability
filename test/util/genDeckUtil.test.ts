import { ACTION, Card, COPPER, ESTATE, SILVER } from '@/tactic'
import { genDecksWith, genDecksWithDouble, withCombinationOfEstates } from '@/util/genDeckUtil'
import { count } from 'arubyray'
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

describe('genDecksWith()', () => {
  it('generates given size decks each contains 3 estate', () => {
    const actual = genDecksWith(SILVER, ACTION)

    expect(actual).toSatisfyAll(
      (deck: Card[]) =>
        deck.length === 12 &&
        count(deck, (card) => card === COPPER) === 7 &&
        count(deck, (card) => card === ESTATE) === 3 &&
        count(deck, (card) => card === SILVER) === 1 &&
        count(deck, (card) => card === ACTION) === 1
    )
  })
})

describe('genDecksWithDouble()', () => {
  it('generates given size decks each contains 3 estate', () => {
    const actual = genDecksWithDouble(SILVER)

    expect(actual).toSatisfyAll(
      (deck: Card[]) =>
        deck.length === 12 &&
        count(deck, (card) => card === COPPER) === 7 &&
        count(deck, (card) => card === ESTATE) === 3 &&
        count(deck, (card) => card === SILVER) === 2
    )
  })
})
