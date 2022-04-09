import { run } from '@/runner'
import { ACTION, Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForAtLeastOnce7,
  topicForBoth5,
  withCombinationOfEstates,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7> | Both<5>

abstract class Tent implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string

  abstract genDecks(): Card[][]

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const h3 = deck.slice(0, 5)

    if (h3.includes(ACTION)) {
      deck = [...deck.slice(0, 5), ACTION, ...deck.slice(5, 12)]
    }

    return splitByNoDraw(deck)
  }
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
      ...topicForAtLeastOnce5(),
      ...topicForAtLeastOnce6(),
      ...topicForAtLeastOnce7(false),
      ...topicForBoth5(),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand, { [ACTION]: 2 }) }
  }
}

class TentWithSilver extends Tent {
  readonly title = () => '銀貨・Tent で4ターン目までに……'

  readonly genDecks = genDecksWithSilverAndAction
}

class TentOnly extends Tent {
  readonly title = () => 'Tent・パス（あるいは騎士見習いなど）で4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(11, (factory, otherIndices) =>
      otherIndices.map((action) =>
        factory.create((deck) => {
          deck[action] = ACTION
        })
      )
    )
  }
}

run(new TentWithSilver(), new TentOnly())
