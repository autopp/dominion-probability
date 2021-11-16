import { COPPER, ESTATE } from '@/tactic'
import { genDeckUtil } from '@/util'
import 'jest-extended'

genDeckUtil.withCombinationOfEstates

describe('genDeckUtil', () => {
  describe('withCombinationOfEstates()', () => {
    it('with 2 argument, generates given size decks each contains 3 estate', () => {
      const actual = genDeckUtil.withCombinationOfEstates(4, (factory) => [factory.create((deck) => deck)])

      expect(actual).toIncludeSameMembers([
        [COPPER, ESTATE, ESTATE, ESTATE],
        [ESTATE, COPPER, ESTATE, ESTATE],
        [ESTATE, ESTATE, COPPER, ESTATE],
        [ESTATE, ESTATE, ESTATE, COPPER],
      ])
    })
  })
})
