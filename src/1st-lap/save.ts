import { run } from '@/runner'
import { Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  atLeastOnce5,
  simpleDeckPattern,
  simulateTurnWithBaseCoinOnly,
  splitByNoDraw,
  withCombinationOfEstates,
} from '@/util'

type Topic = AtLeastOnce<5>

class Base implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銅貨7枚・屋敷3枚で保存があるとき、2ターン目までに……'

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
      atLeastOnce5: atLeastOnce5(t1, t2) || t1.coin === 3,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      atLeastOnce5: '5金を出せる確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    return simulateTurnWithBaseCoinOnly(hand)
  }
}

run(new Base())
