import { run } from '@/runner'
import { Card, Result, Tactic } from '@/tactic'
import { simpleDeckPattern, splitByNoDraw, sumOfCoin, withCombinationOfEstates } from '@/util'

type Topic = 'max5' | 'max4'

class WayOfTheMonkey implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '避難所場でサルの習性もしくラバの習性がある時、2ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(10, 2, (factory) => [
      factory.create(() => {
        return
      }),
    ])
  }
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const coins = deck.map((hand) => sumOfCoin(hand))

    return {
      max5: Math.max(...coins) === 5,
      max4: Math.max(...coins) === 4,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      max5: '5-3もしくは3-5となる確率',
      max4: '4-4となる確率',
    }
  }
}

run(new WayOfTheMonkey())
