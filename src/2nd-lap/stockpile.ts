import { run } from '@/runner'
import { Card, GOLD, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  BothAndAtLeastOnce,
  genDecksWithDouble,
  resultOfAtLeastOnces,
  resultOfBothAndAtLeastOnce,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce,
  topicForAtLeastOnces,
  topicForBothAndAtLeastOnce,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7 | 8 | 9> | BothAndAtLeastOnce<5, 6>

class Stockpile implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '備蓄品・備蓄品で4ターン目までに……'

  genDecks = () => genDecksWithDouble(GOLD)
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map((hand) => ({ coin: sumOfCoin(hand) }))

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7, 8, 9),
      ...resultOfBothAndAtLeastOnce(t3, t4, 5, 6),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6, 7, 8),
      ...topicForAtLeastOnce(9, false),
      ...topicForBothAndAtLeastOnce(5, 6),
    }
  }
}

run(new Stockpile())
