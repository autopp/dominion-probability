import { ACTION, Card, COPPER, ESTATE, GOLD, SILVER } from '@/tactic'
import { sumOfCoin } from '@/util/simulateUtil'

describe('sumOfCoin', () => {
  it('returns sum of coin', () => {
    const PLATINUM: Card = 'PLATINUM'
    const hand = [COPPER, SILVER, GOLD, PLATINUM, ESTATE, ACTION]
    expect(sumOfCoin(hand, { [PLATINUM]: 5, [ACTION]: () => 4 })).toEqual(15)
  })
})
