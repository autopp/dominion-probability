import { run } from '@/runner'
import { ACTION, Card, ESTATE, GOLD, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWith,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByDraw,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce8,
  topicForAtLeastOnces,
  topicForBoth5,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7 | 8> | Both<5>

abstract class Skulk implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]
  abstract splitToHands(deck: Card[]): [Card[], Card[]]

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7, 8),
      ...resultOfBoth5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6, 7),
      ...topicForAtLeastOnce8(false),
      ...topicForBoth5(),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand) }
  }
}

class SkulkWithSilver extends Skulk {
  readonly title = () => '銀貨・暗躍者（+ 金貨）で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWith(SILVER, GOLD, ESTATE)
  }

  splitToHands = splitByNoDraw
}

class SkulkWithDraw extends Skulk {
  readonly title = () => '暗躍者（+ 金貨）・2ドローカード（堀など）で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWith(ACTION, GOLD, ESTATE)
  }

  splitToHands(deck: Card[]) {
    return splitByDraw(deck, 2)
  }
}

class SkulkOnly extends Skulk {
  readonly title = () => '暗躍者（+ 金貨）・パス（あるいは騎士見習いなど）で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWith(GOLD, ESTATE)
  }

  splitToHands = splitByNoDraw
}

run(new SkulkWithSilver(), new SkulkWithDraw(), new SkulkOnly())
