import { run } from '@/runner'
import { ACTION, Card, ESTATE, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForBoth5,
} from '@/util'

type Topic = AtLeastOnce<5 | 6> | Both<5>

class OldMap implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銀貨・Old Map で4ターン目までに……'

  genDecks = genDecksWithSilverAndAction
  splitToHands(deck: Card[]): [Card[], Card[]] {
    const i = deck.findIndex((card) => card === ACTION)
    if (i >= 0 && i < 5) {
      return [[...deck.slice(0, 6).sort(), deck[6]], deck.slice(7, 12).sort()]
    }
    if (i >= 5 && i < 10) {
      return [deck.slice(0, 5).sort(), [...deck.slice(5, 11).sort(), deck[11]]]
    }
    return splitByNoDraw(deck)
  }
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      ...resultOfBoth5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnce5(),
      ...topicForAtLeastOnce6(false),
      ...topicForBoth5(),
    }
  }

  private simulateTurn(hand: Card[]) {
    let coin = sumOfCoin(hand)
    if (!hand.slice(0, 6).includes(ESTATE)) {
      coin -= 1
    }

    return { coin }
  }
}

run(new OldMap())
