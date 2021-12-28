import { run } from '@/runner'
import { ACTION, Card, COPPER, Result, SILVER, Tactic } from '@/tactic'
import {
  any,
  AtLeastOnce,
  atLeastOnce5,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  sumOfCoin,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
  withCombinationOfEstates,
} from '@/util'
import { permutation } from 'arubyray'

type Topic = AtLeastOnce<5 | 6 | 7> | 'gained' | 'gainedAndAtLeastOnce5'

const MAGPIE: Card = 'magpie'

abstract class Magpie implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]

  splitToHands(deck: Card[]) {
    const magpie = deck.findIndex((card) => card === MAGPIE)

    if (magpie >= 0 && magpie < 5) {
      return this.isTreasure(deck[6])
        ? ([deck.slice(0, 7), deck.slice(7, 12)] as [Card[], Card[]])
        : ([deck.slice(0, 6), deck.slice(6, 11)] as [Card[], Card[]])
    } else if (magpie >= 5 && magpie < 10) {
      return this.isTreasure(deck[11])
        ? ([deck.slice(0, 5).sort(), deck.slice(5, 12)] as [Card[], Card[]])
        : ([deck.slice(0, 5).sort(), deck.slice(5, 11)] as [Card[], Card[]])
    } else {
      return [deck.slice(0, 5).sort(), deck.slice(5, 10).sort()] as [Card[], Card[]]
    }
  }

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)
    const gained = any(t3, t4, 'gained')

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      gained,
      gainedAndAtLeastOnce5: gained && atLeastOnce5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForAtLeastOnce7(false),
      gained: 'カササギを獲得する確率',
      gainedAndAtLeastOnce5: 'カササギを獲得しつつ一度でも5金以上が出る確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    const coin = sumOfCoin(hand, { [ACTION]: 2 })

    return { coin, gained: hand.length === 6 }
  }

  private isTreasure(card: Card) {
    return card === COPPER || card === SILVER
  }
}

class MagpieWithSilver extends Magpie {
  readonly title = () => '銀貨・カササギで4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(12, (factory, otherIndices) =>
      permutation(otherIndices, 2).map(([magpie, silver]) =>
        factory.create((deck) => {
          deck[magpie] = MAGPIE
          deck[silver] = SILVER
        })
      )
    )
  }
}

class MagpieWithAction extends Magpie {
  readonly title = () => '木こり・カササギで4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(12, (factory, otherIndices) =>
      permutation(otherIndices, 2).map(([magpie, silver]) =>
        factory.create((deck) => {
          deck[magpie] = MAGPIE
          deck[silver] = ACTION
        })
      )
    )
  }
}

run(new MagpieWithSilver(), new MagpieWithAction())
