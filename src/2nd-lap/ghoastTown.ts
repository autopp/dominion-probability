import { run } from '@/runner'
import { Card, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  simulateTurnWithBaseCoinOnly,
  splitInto,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
  withCombinationOfEstates,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7>

class GhostTown implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銀貨・ゴーストタウンで4ターン目までに……'

  genDecks = () =>
    withCombinationOfEstates(11, (factory, otherIndices) =>
      otherIndices.map((silver) =>
        factory.create((deck) => {
          deck[silver] = SILVER
        })
      )
    )
  splitToHands = (deck: Card[]) => splitInto(deck, 6, 5)
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

run(new GhostTown())
