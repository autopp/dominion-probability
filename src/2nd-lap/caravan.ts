import { run } from '@/runner'
import { ACTION, Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  simulateTurnWithBaseCoinOnly,
  splitByNoDraw,
  splitInto,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7>

class Caravan implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銀貨・隊商で4ターン目までに……'

  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const i = deck.indexOf(ACTION)

    if (i >= 0 && i < 5) {
      return splitInto(deck, 6, 6)
    }

    if (i >= 5 && i < 10) {
      return splitInto(deck, 5, 6)
    }

    return splitByNoDraw(deck)
  }

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(simulateTurnWithBaseCoinOnly)

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
}

run(new Caravan())
