import { run } from '@/runner'
import { ACTION, Card, COPPER, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  BothAndAtLeastOnce,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth,
  resultOfBoth5,
  resultOfBothAndAtLeastOnce,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce,
  topicForAtLeastOnces,
  topicForBoth,
  topicForBoth5,
  topicForBothAndAtLeastOnce,
} from '@/util'
import { count } from 'arubyray'

type Topic = AtLeastOnce<5 | 6 | 7 | 8> | Both<5 | 6> | BothAndAtLeastOnce<5, 6>

class Coppersmith implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銀貨・銅細工師で4ターン目までに……'

  genDecks = genDecksWithSilverAndAction
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7, 8),
      ...resultOfBoth5(t3, t4),
      ...resultOfBoth(t3, t4, 6),
      ...resultOfBothAndAtLeastOnce(t3, t4, 5, 6),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6, 7),
      ...topicForAtLeastOnce(8, false),
      ...topicForBoth5(),
      ...topicForBoth(6, false),
      ...topicForBothAndAtLeastOnce(5, 6, false),
    }
  }

  private simulateTurn(hand: Card[]) {
    let coin = sumOfCoin(hand)

    if (hand.includes(ACTION)) {
      coin += count(hand, (c) => c === COPPER)
    }

    return { coin }
  }
}

run(new Coppersmith())
