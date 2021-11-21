import { Card, COPPER, GOLD, SILVER } from '@/tactic'

export function sumOfCoin(hand: Card[], others: { [k: Card]: number | (() => number) } = {}): number {
  const mapper: typeof others = {
    [COPPER]: 1,
    [SILVER]: 2,
    [GOLD]: 3,
    ...others,
  }

  return hand.reduce((sum, card) => {
    const coin = mapper[card]
    if (typeof coin === 'number') {
      return sum + coin
    }
    if (typeof coin === 'function') {
      return sum + coin()
    }
    return sum
  }, 0)
}

export function simulateTurnWithBaseCoinOnly(hand: Card[]): { coin: number } {
  return { coin: sumOfCoin(hand) }
}
