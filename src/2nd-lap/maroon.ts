import { run } from '@/runner'
import { ACTION, Card, ESTATE, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
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
  topicForBoth5,
  topicForTrashingEstate,
  topicForTrashingEstateAndAtLeastOnce5,
} from '@/util'

type Topic = AtLeastOnce<5 | 6> | Both<5> | TrashingEstate | TrashingEstateAndAtLeastOnce<5>

class Maroon implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '屋敷場かつ銀貨・置き去りで4ターン目までに……'

  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const i = deck.findIndex((card) => card === ACTION)
    if (i >= 0 && i < 5) {
      return [deck.slice(0, 7), deck.slice(7, 12).sort()]
    }
    if (i >= 5 && i < 10) {
      return [deck.slice(0, 5).sort(), deck.slice(5, 12)]
    }

    return splitByNoDraw(deck)
  }

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      ...resultOfBoth5(t3, t4),
      ...resultOfTrashingEstate(t3, t4),
      ...resultOfTrashingEstateAndAtLeastOnce5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnce5(),
      ...topicForAtLeastOnce6(false),
      ...topicForBoth5(),
      ...topicForTrashingEstate(),
      ...topicForTrashingEstateAndAtLeastOnce5(),
    }
  }

  private simulateTurn(hand: Card[]) {
    let coin = sumOfCoin(hand)
    let trashingEstate = false
    if (hand.includes(ACTION)) {
      if (hand.slice(0, 5).includes(ESTATE)) {
        trashingEstate = true
      } else {
        coin -= 1
      }
    }

    return { coin, trashingEstate }
  }
}

run(new Maroon())
