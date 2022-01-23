import { run } from '@/runner'
import { ACTION, Card, ESTATE, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth5,
  resultOfTrashingEstate,
  resultOfTrashingEstateAndAtLeastOnce5,
  simpleDeckPattern,
  simulateTurnWithBaseCoinOnly,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForBoth5,
  topicForTrashingEstate,
  topicForTrashingEstateAndAtLeastOnce5,
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
  withCombinationOfEstates,
} from '@/util'

type Topic = AtLeastOnce<5>

class Base implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銅貨7枚・屋敷3枚で2ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(10, (factory) => {
      return [
        factory.create(() => {
          return
        }),
      ]
    })
  }
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t1, t2] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t1, t2, 5),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      atLeastOnce5: '5-2もしくは2-5となる確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    return simulateTurnWithBaseCoinOnly(hand)
  }
}

run(new Base())
