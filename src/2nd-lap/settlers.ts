import { run } from '@/runner'
import { ACTION, Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  genDecksWithDouble,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  splitByDraw,
  splitByNoDraw,
  splitInto,
  sumOfCoin,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
} from '@/util'
import { count } from 'arubyray'

type Topic = AtLeastOnce<5 | 6 | 7>

abstract class Settlers implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): string[][]

  abstract splitToHands(deck: Card[]): [Card[], Card[]]

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

    if (canPickUp) {
      coin += count(hand, (c) => c === ACTION)
    }

    return { coin }
  }
}

class SettlersWithSilver extends Settlers {
  title = () => '銀・開拓者で4ターン目までに……'
  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]) {
    return splitByDraw(deck, 1)
  }
}

class DoubleSettlers extends Settlers {
  title = () => '開拓者・開拓者で4ターン目までに……'
  genDecks() {
    return genDecksWithDouble(ACTION)
  }

  splitToHands(deck: Card[]) {
    const first = deck.findIndex((c) => c === ACTION)
    const second = deck.slice(first).findIndex((c) => c === ACTION) + first + 1

    if (first >= 0 && first < 5) {
      if (second >= 1 && second < 6) {
        return splitInto(deck, 7, 5)
      } else if (second < 11) {
        return splitInto(deck, 6, 6)
      } else {
        return splitInto(deck, 6, 5)
      }
    } else if (first >= 5 && first < 10) {
      if (second >= 6 && second < 11) {
        return splitInto(deck, 5, 7)
      } else {
        return splitInto(deck, 5, 6)
      }
    } else {
      return splitByNoDraw(deck)
    }
  }
}

run(new SettlersWithSilver(), new DoubleSettlers())
