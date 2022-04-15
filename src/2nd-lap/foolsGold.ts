import { run } from '@/runner'
import { Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithDouble,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce8,
  topicForAtLeastOnces,
  topicForBoth5,
} from '@/util'
import { count } from 'arubyray'

type Topic = AtLeastOnce<5 | 6 | 7 | 8> | Both<5>

const FOOLS_GOLD = 'foolsGold'

class FoolsGold implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '愚者の黄金・愚者の黄金で4ターン目までに……'

  genDecks = () => genDecksWithDouble(FOOLS_GOLD)
  splitToHands = splitByNoDraw
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
    let coin = sumOfCoin(hand)
    const foolsGolds = count(hand, (c) => c === FOOLS_GOLD)
    if (foolsGolds > 0) {
      coin += 4 * (foolsGolds - 1) + 1
    }

    return { coin }
  }
}

run(new FoolsGold())
