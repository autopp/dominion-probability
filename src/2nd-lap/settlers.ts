import { run } from '@/runner'
import { ACTION, Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  splitByDraw,
  sumOfCoin,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7>

class Settlers implements Tactic<[Card[], Card[]], Topic> {
  title = () => '銀・開拓者で4ターン目までに……'
  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]) {
    return splitByDraw(deck, 1)
  }

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const t3 = this.simulateTurn(deck[0], false)
    const t4 = this.simulateTurn(deck[1], true)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForAtLeastOnce7(false),
    }
  }

  private simulateTurn(hand: Card[], canPickUp: boolean) {
    let coin = sumOfCoin(hand)

    if (canPickUp && hand.includes(ACTION)) {
      coin++
    }

    return { coin }
  }
}

run(new Settlers())
