import { run } from '@/runner'
import { Card, GOLD, Result, Tactic } from '@/tactic'
import { simpleDeckPattern, splitByNoDraw, sumOfCoin, withCombinationOfEstates } from '@/util'

type Topic = 'max7' | 'max6' | 'max5'

class CursedGold implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銅貨7枚・屋敷3枚で2ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(10, (factory, otherIndices) =>
      otherIndices.map((cursedGold) =>
        factory.create((deck) => {
          deck[cursedGold] = GOLD
        })
      )
    )
  }
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const coins = deck.map((hand) => sumOfCoin(hand))

    return {
      max5: Math.max(...coins) === 5,
      max6: Math.max(...coins) === 6,
      max7: Math.max(...coins) === 7,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      max5: '5-4もしくは4-5となる確率',
      max6: '6-3もしくは3-6となる確率',
      max7: '7-2もしくは2-7となる確率',
    }
  }
}

run(new CursedGold())
