import { COPPER, ESTATE } from '@/tactic'
import { withCombinationOfEstates } from '@/util/genDeckUtil'
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
