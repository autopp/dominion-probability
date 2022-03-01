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
  splitByNoDraw,
  splitInto,
  sumOfCoin,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForBoth5,
  topicForTrashingEstate,
  topicForTrashingEstateAndAtLeastOnce5,
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
} from '@/util'

type Topic = AtLeastOnce<5 | 6> | Both<5> | TrashingEstate | TrashingEstateAndAtLeastOnce<5>

class Broker implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '屋敷場かつ銀貨・Broker で常に+カード効果を使う場合、4ターン目までに……'

  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const i = deck.findIndex((card) => card === ACTION)
    if (i >= 0 && i < 5 && deck.slice(0, 5).includes(ESTATE)) {
      return splitInto(deck, 7, 5)
    }
    if (i >= 5 && i < 10 && deck.slice(5, 10).includes(ESTATE)) {
      return splitInto(deck, 5, 7)
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
    const coin = sumOfCoin(hand)
    const trashingEstate = hand.includes(ACTION) && hand.includes(ESTATE)

    return { coin, trashingEstate }
  }
}

run(new Broker())
