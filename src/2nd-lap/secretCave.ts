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
  topicForAtLeastOnces,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7 | 8>

abstract class SecretCave implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]
  abstract splitToHands(deck: Card[]): [Card[], Card[]]

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [hand3, hand4] = deck
    const t3 = this.simulateTurn(hand3, false)
    const t4 = this.simulateTurn(hand4, t3.duration)

    return resultOfAtLeastOnces(t3, t4, 5, 6, 7, 8)
  }

  topics(): { [t in Topic]: string } {
    return topicForAtLeastOnces(5, 6, 7, 8)
  }

  private simulateTurn(hand: Card[], duration: boolean) {
    const actionIncluded = hand.includes(ACTION)
    let coin = sumOfCoin(hand)
    if (duration) {
      coin += 3
    }

    return { coin, duration: actionIncluded && coin < 6 }
  }
}

class SecretCaveWithSilver extends SecretCave {
  readonly title = () => '銀貨・秘密の洞窟で4ターン目までに……'

  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]): [Card[], Card[]] {
    return splitByDraw(deck, 1)
  }
}

class DoubleSecretCave extends SecretCave {
  readonly title = () => '秘密の洞窟・秘密の洞窟で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWithDouble(ACTION)
  }

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const first = deck.findIndex((c) => c === ACTION)
    const second = deck.slice(first + 1).findIndex((c) => c === ACTION) + first + 1
    if (first >= 0 && first < 5) {
      if (second >= 1 && second < 6) {
        return splitInto(deck, 7, 5)
      } else if (second >= 6 && second < 11) {
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

run(new SecretCaveWithSilver(), new DoubleSecretCave())
