import { run } from '@/runner'
import { ACTION, Card, ESTATE, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth5,
  resultOfTrashingEstate,
  resultOfTrashingEstateAndAtLeastOnce5,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForAtLeastOnces,
  topicForBoth5,
  topicForTrashingEstate,
  topicForTrashingEstateAndAtLeastOnce5,
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
} from '@/util'
import { take } from 'arubyray'

type Topic = AtLeastOnce<5 | 6> | Both<5> | TrashingEstate | TrashingEstateAndAtLeastOnce<5>

class Develop implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銀貨・開発で屋敷は銀貨に変える場合、4ターン目までに……'

  genDecks = genDecksWithSilverAndAction
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const t3 = this.simulateTurn(deck[0])
    const hand4 = t3.trashingEstate ? [SILVER, ...take(deck[1], 4)] : deck[1]
    const t4 = this.simulateTurn(hand4)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      ...resultOfBoth5(t3, t4),
      ...resultOfTrashingEstate(t3, t4),
      ...resultOfTrashingEstateAndAtLeastOnce5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForBoth5(),
      ...topicForTrashingEstate(),
      ...topicForTrashingEstateAndAtLeastOnce5(),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand), trashingEstate: hand.includes(ACTION) && hand.includes(ESTATE) }
  }
}

run(new Develop())
