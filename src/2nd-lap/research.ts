import { run } from '@/runner'
import { ACTION, Card, ESTATE, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfTrashingEstate,
  resultOfTrashingEstateAndAtLeastOnce5,
  simpleDeckPattern,
  sumOfCoin,
  topicForAtLeastOnce8,
  topicForAtLeastOnces,
  topicForTrashingEstate,
  topicForTrashingEstateAndAtLeastOnce5,
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7 | 8> | TrashingEstate | TrashingEstateAndAtLeastOnce<5>

class Research implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銀貨・研究で4ターン目までに……'

  genDecks = genDecksWithSilverAndAction
  splitToHands(deck: Card[]) {
    const hand3 = deck.slice(0, 5).sort()
    const hand4 = hand3.includes(ACTION) && hand3.includes(ESTATE) ? deck.slice(5, 12).sort() : deck.slice(5, 10).sort()

    return [hand3, hand4] as [Card[], Card[]]
  }
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7, 8),
      ...resultOfTrashingEstate(t3, t4),
      ...resultOfTrashingEstateAndAtLeastOnce5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6, 7),
      ...topicForAtLeastOnce8(),
      ...topicForTrashingEstate(),
      ...topicForTrashingEstateAndAtLeastOnce5(),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand), trashingEstate: hand.includes(ACTION) && hand.includes(ESTATE) }
  }
}

run(new Research())
