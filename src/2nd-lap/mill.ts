import { run } from '@/runner'
import { ACTION, Card, ESTATE, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByDraw,
  sumOfCoin,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
  topicForBoth5,
  withCombinationOfEstates,
} from '@/util'
import { count, permutation } from 'arubyray'

type Topic = AtLeastOnce<5 | 6 | 7> | Both<5>

abstract class Mill implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string

  abstract genDecks(): Card[][]

  splitToHands(deck: Card[]) {
    return splitByDraw(deck, 1)
  }

  readonly patternsOfDeck = simpleDeckPattern

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
    return {
      coin: sumOfCoin(hand, {
        [ACTION]: () =>
          Math.min(
            count(hand, (x) => x === ESTATE),
            2
          ),
      }),
    }
  }
}

class MillWithNormalStartHand extends Mill {
  title = () => '銀貨・風車で4ターン目までに……'
  genDecks = genDecksWithSilverAndAction
}

class MillWithTrashingHovel extends Mill {
  title = () => '銀貨・風車（納屋廃棄）で4ターン目までに……'
  genDecks() {
    return withCombinationOfEstates(11, 2, (factory, otherIndices) =>
      permutation(otherIndices, 2).map(([silver, action]) =>
        factory.create((deck) => {
          deck[silver] = SILVER
          deck[action] = ACTION
        })
      )
    )
  }
}

run(new MillWithNormalStartHand())
run(new MillWithTrashingHovel())
