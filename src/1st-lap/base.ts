import { run } from '@/runner'
import { Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  simulateTurnWithBaseCoinOnly,
  splitByNoDraw,
  withCombinationOfEstates,
} from '@/util'

type Topic = AtLeastOnce<5>

class Base implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銅貨7枚・屋敷3枚で2ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(10, (factory) => {
      return [factory.create()]
    })
  }
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t1, t2] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t1, t2, 5),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      atLeastOnce5: '5-2もしくは2-5となる確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    return simulateTurnWithBaseCoinOnly(hand)
  }
}

run(new Base())
