import { run } from '@/runner'
import { Card, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
  topicForBoth5,
  withCombinationOfEstates,
} from '@/util'
import { combination, count, permutation } from 'arubyray'

type Topic = AtLeastOnce<5 | 6 | 7> | Both<5>

const DUCAT: Card = 'ducat'

abstract class Ducat implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '屋敷場かつ銀貨・司教で4ターン目までに……'

  abstract genDecks(): Card[][]
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [hand3, hand4] = deck
    const t3 = this.simulateTurn(hand3, 0, false)
    const t4 = this.simulateTurn(hand4, t3.coffer, true)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      ...resultOfBoth5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForAtLeastOnce7(false),
      ...topicForBoth5(),
    }
  }

  private simulateTurn(hand: Card[], coffer: number, usingAllCoffer: boolean) {
    const coin = sumOfCoin(hand)
    const allCoffer = coffer + count(hand, (c) => c === DUCAT)
    const usedCoffer = usingAllCoffer ? allCoffer : coin < 5 && coin + allCoffer >= 5 ? 5 - coin : 0

    return { coin: coin + usedCoffer, coffer: allCoffer - usedCoffer }
  }
}

class DucatWithSilver extends Ducat {
  title = () => '銀貨・ドゥカート金貨（銅貨廃棄）で4ターン目までに……'
  genDecks = () =>
    withCombinationOfEstates(11, (factory, otherIndices) =>
      permutation(otherIndices, 2).map(([silver, ducat]) =>
        factory.create((deck) => {
          deck[silver] = SILVER
          deck[ducat] = DUCAT
        })
      )
    )
}

class DoubleDucat extends Ducat {
  title = () => 'ドゥカート金貨・ドゥカート金貨（銅貨2枚廃棄）で4ターン目までに……'
  genDecks = () =>
    withCombinationOfEstates(10, (factory, otherIndices) =>
      combination(otherIndices, 2).map(([ducat1, ducat2]) =>
        factory.create((deck) => {
          deck[ducat1] = DUCAT
          deck[ducat2] = DUCAT
        })
      )
    )
}

run(new DucatWithSilver(), new DoubleDucat())
