import { run } from '@/runner'
import { Card, COPPER, ESTATE, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  simulateTurnWithBaseCoinOnly,
  splitByNoDraw,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForBoth5,
  withCombinationOfEstates,
} from '@/util'
import { combination } from 'arubyray'

type Topic = AtLeastOnce<5 | 6> | Both<5>

abstract class Castle implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]

  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(simulateTurnWithBaseCoinOnly)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      ...resultOfBoth5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnce5(),
      ...topicForAtLeastOnce6(false),
      ...topicForBoth5(),
    }
  }
}

class CastleWithSilver extends Castle {
  title = () => '銀貨・粗末な城納屋廃棄で4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(11, 2, (factory, otherIndices) =>
      otherIndices.map((silver) =>
        factory.create((deck) => {
          deck[silver] = SILVER
        })
      )
    )
  }
}

class DoubleCastle extends Castle {
  title = () => '粗末な城・粗末な城納屋廃棄で4ターン目までに……'

  genDecks() {
    return combination([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2).map((others) => {
      const deck = [COPPER, COPPER, COPPER, COPPER, COPPER, COPPER, COPPER, COPPER, COPPER, COPPER, COPPER]
      deck[others[0]] = ESTATE
      deck[others[1]] = ESTATE
      return deck
    })
  }
}

run(new CastleWithSilver(), new DoubleCastle())
