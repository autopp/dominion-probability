import { run } from '@/runner'
import { COPPER, Card, ESTATE, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
  genDecksWith,
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
const ROPE = 'rope'

class Rope implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '屋敷場かつ銀貨・縄で4ターン目までに……'

  genDecks = () => genDecksWith(SILVER, ROPE)

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const i = deck.findIndex((card) => card === ROPE)
    if (i >= 0 && i < 5) {
      return [deck.slice(0, 5).sort(), deck.slice(5, 11).sort()]
    }

    return splitByNoDraw(deck)
  }

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const t3 = this.simulateTurn(deck[0], false)
    const t4 = this.simulateTurn(deck[1], t3.duration)

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

  private simulateTurn(hand: Card[], duration: boolean) {
    let coin = sumOfCoin(hand, { [ROPE]: 1 })
    let trashingEstate = false
    if (duration) {
      if (hand.includes(ESTATE)) {
        trashingEstate = true
      } else {
        coin -= 1
      }
    }

    return { coin, trashingEstate, duration: hand.includes(ROPE) }
  }
}

class RopeSilver extends Rope {
  readonly title = () => '屋敷場かつ銀貨・縄で4ターン目までに……'

  genDecks = () => genDecksWith(SILVER, ROPE)
}

class RopeCopper extends Rope {
  readonly title = () => '屋敷場かつ銀貨・銅貨（あるいは農民など）で4ターン目までに……'

  genDecks = () => genDecksWith(COPPER, ROPE)
}

run(new RopeSilver(), new RopeCopper())
