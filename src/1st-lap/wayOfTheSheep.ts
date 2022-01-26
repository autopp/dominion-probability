import { run } from '@/runner'
import { Card, Result, SILVER, Tactic } from '@/tactic'
import { simpleDeckPattern, splitByNoDraw, sumOfCoin, withCombinationOfEstates } from '@/util'

type Topic = 'max6' | 'max5'

class WayOfTheSheep implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '避難所場で羊の習性がある時、2ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(10, 2, (factory, otherIndices) =>
      otherIndices.map((necropolis) =>
        factory.create((deck) => {
          deck[necropolis] = SILVER
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
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      max5: '5-4もしくは4-5となる確率',
      max6: '6-3もしくは3-6となる確率',
    }
  }
}

run(new WayOfTheSheep())
