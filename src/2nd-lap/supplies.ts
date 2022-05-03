import { run } from '@/runner'
import { Card, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWith,
  genDecksWithDouble,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  sumOfCoin,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
  topicForBoth5,
} from '@/util'
import { count } from 'arubyray'

type Topic = AtLeastOnce<5 | 6 | 7> | Both<5>
const SUPPLIES: Card = 'supplies'

abstract class Supplies implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]
  abstract splitToHands(deck: Card[]): [Card[], Card[]]

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      ...resultOfBoth5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForAtLeastOnce7(false),
      ...topicForBoth5(),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand, { [SUPPLIES]: 1 }) }
  }
}

class SuppliesWithSilver extends Supplies {
  readonly title = () => '銀貨・配給品で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWith(SILVER, SUPPLIES)
  }

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const i = deck.indexOf(SUPPLIES)
    return i >= 0 && i < 5
      ? [deck.slice(0, 5).sort(), deck.slice(5, 11).sort()]
      : [deck.slice(0, 5).sort(), deck.slice(5, 10).sort()]
  }
}

class DoubleSupplies extends Supplies {
  readonly title = () => '配給品・配給品で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWithDouble(SUPPLIES)
  }

  splitToHands(deck: Card[]): [Card[], Card[]] {
    switch (count(deck.slice(0, 5), (c) => c === SUPPLIES)) {
      case 2:
        return [deck.slice(0, 5).sort(), deck.slice(5, 12).sort()]
      case 1:
        return [deck.slice(0, 5).sort(), deck.slice(5, 11).sort()]
      default:
        return [deck.slice(0, 5).sort(), deck.slice(5, 10).sort()]
    }
  }
}

run(new SuppliesWithSilver(), new DoubleSupplies())
