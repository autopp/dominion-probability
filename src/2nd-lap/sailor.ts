import { run } from '@/runner'
import { ACTION, COPPER, Card, ESTATE, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWith,
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
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
} from '@/util'

type Topic = AtLeastOnce<5 | 6> | Both<5> | TrashingEstate | TrashingEstateAndAtLeastOnce<5>

abstract class Sailor implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]

  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [hand3, hand4] = deck
    const t3 = this.simulateTurn(hand3, false)
    const t4 = this.simulateTurn(hand4, t3.duration)

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
    let coin = sumOfCoin(hand)
    let trashingEstate = false
    if (duration) {
      if (hand.includes(ESTATE)) {
        coin += 2
        trashingEstate = true
      } else {
        coin += 1
      }
    }

    return { coin, duration: hand.includes(ACTION), trashingEstate }
  }
}

class SailorWithSilver extends Sailor {
  readonly title = () => '船乗り・銀貨で4ターン目までに……'
  genDecks = genDecksWithSilverAndAction
}

class SailorWithCopper extends Sailor {
  readonly title = () => '船乗り・銅貨（あるいは農民など）で4ターン目までに……'
  genDecks = () => genDecksWith(COPPER, ACTION)
}

class SailorOnly extends Sailor {
  readonly title = () => '船乗り・パス（あるいは騎士見習いなど）で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWith(ACTION)
  }
}

run(new SailorWithSilver(), new SailorWithCopper(), new SailorOnly())
