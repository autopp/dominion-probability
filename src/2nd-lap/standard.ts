import { run } from '@/runner'
import { Card, Result, Tactic } from '@/tactic'
import {
  Both,
  BothAndAtLeastOnce,
  genDecksWithDoubleSilver,
  resultOfBoth4,
  resultOfBothAndAtLeastOnce,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForBoth4,
  topicForBothAndAtLeastOnce,
} from '@/util'

type DoubleSilverTopic = Both<4> | BothAndAtLeastOnce<4, 5>

class DoubleSilver implements Tactic<[Card[], Card[]], DoubleSilverTopic> {
  title = () => '銀貨・銀貨で4ターン目までに……'
  genDecks = genDecksWithDoubleSilver
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<DoubleSilverTopic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfBoth4(t3, t4),
      ...resultOfBothAndAtLeastOnce(t3, t4, 4, 5),
    }
  }

  topics(): { [t in DoubleSilverTopic]: string } {
    return {
      ...topicForBoth4(),
      ...topicForBothAndAtLeastOnce(4, 5),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand) }
  }
}

run(new DoubleSilver())
