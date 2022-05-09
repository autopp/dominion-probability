import { run } from '@/runner'
import { ACTION, Card, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  BothAndAtLeastOnce,
  genDecksWith,
  resultOfAtLeastOnces,
  resultOfBoth5,
  resultOfBothAndAtLeastOnce,
  simpleDeckPattern,
  splitByDraw,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnces,
  topicForBoth5,
  topicForBothAndAtLeastOnce,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7 | 8> | Both<5> | BothAndAtLeastOnce<5, 6>

abstract class Silver implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]
  abstract splitToHands(deck: Card[]): [Card[], Card[]]

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7, 8),
      ...resultOfBoth5(t3, t4),
      ...resultOfBothAndAtLeastOnce(t3, t4, 5, 6),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6, 7, 8),
      ...topicForBoth5(),
      ...topicForBothAndAtLeastOnce(5, 6),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand) }
  }
}

class TripleSilver extends Silver {
  readonly title = () => '銀貨・銀貨・銀貨で4ターン目までに……'

  genDecks() {
    return genDecksWith(SILVER, SILVER, SILVER)
  }

  splitToHands = splitByNoDraw
}

class DoubleSilverWithTwoDraw extends Silver {
  readonly title = () => '銀貨・銀貨・2ドローカード（堀など）で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWith(SILVER, SILVER, ACTION)
  }

  splitToHands(deck: Card[]) {
    return splitByDraw(deck, 2)
  }
}

run(new TripleSilver(), new DoubleSilverWithTwoDraw())
