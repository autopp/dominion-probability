import { run } from '@/runner'
import { ACTION, Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  splitByNoDraw,
  splitInto,
  sumOfCoin,
  topicForAtLeastOnce8,
  topicForAtLeastOnces,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7 | 8>

class CabinBoy implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銀貨・キャビンボーイで4ターン目までに……'

  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const i = deck.indexOf(ACTION)

    if (i >= 0 && i < 5) {
      return splitInto(deck, 6, 5)
    }

    if (i >= 5 && i < 10) {
      return splitInto(deck, 5, 6)
    }

    return splitByNoDraw(deck)
  }

  patternsOfDeck = simpleDeckPattern

  simulate([hand3, hand4]: [Card[], Card[]]): Result<Topic> {
    const t3 = this.simulateTurn(hand3, false)
    const t4 = this.simulateTurn(hand4, t3.duration)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7, 8),
    }
  }

  simulateTurn(hand: Card[], duration: boolean) {
    const coin = sumOfCoin(hand) + (duration ? 2 : 0)
    return { coin, duration: hand.includes(ACTION) }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6, 7),
      ...topicForAtLeastOnce8(false),
    }
  }
}

run(new CabinBoy())
