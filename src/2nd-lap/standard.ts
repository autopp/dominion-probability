import { run } from '@/runner'
import { Card, Result, Tactic } from '@/tactic'
import {
  Both,
  BothAndAtLeastOnce,
  genDecksWithDoubleSilver,
  genDecksWithSilverAndAction,
  resultOfBoth4,
  resultOfBothAndAtLeastOnce,
  simpleDeckPattern,
  splitByDraw,
  splitByNoDraw,
  sumOfCoin,
  topicForBoth4,
  topicForBothAndAtLeastOnce,
} from '@/util'

type Topic = Both<4> | BothAndAtLeastOnce<4, 5>

class DoubleSilver implements Tactic<[Card[], Card[]], Topic> {
  title = () => '銀貨・銀貨で4ターン目までに……'
  genDecks = genDecksWithDoubleSilver
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfBoth4(t3, t4),
      ...resultOfBothAndAtLeastOnce(t3, t4, 4, 5),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForBoth4(),
      ...topicForBothAndAtLeastOnce(4, 5),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand) }
  }
}

class SilverWithTwoDraw implements Tactic<[Card[], Card[]], Topic> {
  title = () => '銀貨・2ドローカード（堀など）で4ターン目までに……'
  genDecks = genDecksWithSilverAndAction
  splitToHands(deck: Card[]) {
    return splitByDraw(deck, 2)
  }
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfBoth4(t3, t4),
      ...resultOfBothAndAtLeastOnce(t3, t4, 4, 5),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForBoth4(),
      ...topicForBothAndAtLeastOnce(4, 5),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand) }
  }
}

run(new DoubleSilver(), new SilverWithTwoDraw())
