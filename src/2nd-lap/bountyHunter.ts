import { run } from '@/runner'
import { ACTION, Card, CURSE, ESTATE, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  BothAndAtLeastOnce,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth,
  resultOfBoth5,
  resultOfBothAndAtLeastOnce,
  resultOfTrashingEstate,
  resultOfTrashingEstateAndAtLeastOnce,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
  topicForBoth,
  topicForBoth5,
  topicForBothAndAtLeastOnce,
  topicForTrashingEstate,
  topicForTrashingEstateAndAtLeastOnce,
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
  withCombinationOfEstates,
} from '@/util'
import { permutation } from 'arubyray'

type Topic =
  | AtLeastOnce<5 | 6 | 7>
  | Both<5 | 6>
  | BothAndAtLeastOnce<5, 6>
  | TrashingEstate
  | TrashingEstateAndAtLeastOnce<6>

abstract class BountyHunter implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]

  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      ...resultOfBoth5(t3, t4),
      ...resultOfBothAndAtLeastOnce(t3, t4, 5, 6),
      ...resultOfBoth(t3, t4, 6),
      ...resultOfTrashingEstate(t3, t4),
      ...resultOfTrashingEstateAndAtLeastOnce(t3, t4, 6),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForAtLeastOnce7(false),
      ...topicForBoth5(),
      ...topicForBoth(6, false),
      ...topicForBothAndAtLeastOnce(5, 6),
      ...topicForTrashingEstate(),
      ...topicForTrashingEstateAndAtLeastOnce(6),
    }
  }

  private simulateTurn(hand: Card[]) {
    let coin = sumOfCoin(hand)
    let trashingEstate = false

    if (hand.includes(ACTION)) {
      if (hand.includes(ESTATE)) {
        coin += 3
        trashingEstate = true
      } else {
        coin += 2
      }
    }

    return { coin, trashingEstate }
  }
}

class BountyHunterWithSilver extends BountyHunter {
  title = () => '銀貨・賞金稼ぎで4ターン目までに……'
  genDecks = genDecksWithSilverAndAction
}

class BountyHunterWithCopper extends BountyHunter {
  title = () => '銅貨（あるいは農民など）・賞金稼ぎで4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(12, (factory, otherIndices) =>
      otherIndices.map((action) =>
        factory.create((deck) => {
          deck[action] = ACTION
        })
      )
    )
  }
}

class BountyHunterOnly extends BountyHunter {
  title = () => '賞金稼ぎ・パス（あるいは騎士見習いなど）で4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(11, (factory, otherIndices) =>
      otherIndices.map((action) =>
        factory.create((deck) => {
          deck[action] = ACTION
        })
      )
    )
  }
}

class BountyHunterWithCurse extends BountyHunter {
  title = () => '賞金稼ぎ・呪い（あるいは工房など）で4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(12, (factory, otherIndices) =>
      permutation(otherIndices, 2).map(([action, curse]) =>
        factory.create((deck) => {
          deck[action] = ACTION
          deck[curse] = CURSE
        })
      )
    )
  }
}

run(new BountyHunterWithSilver(), new BountyHunterWithCopper(), new BountyHunterOnly(), new BountyHunterWithCurse())
