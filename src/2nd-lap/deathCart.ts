import { run } from '@/runner'
import { Card, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  resultOfAny,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnces,
  topicForBoth5,
  withCombinationOfEstates,
} from '@/util'
import { combination, difference, permutation } from 'arubyray'

const DEATH_CART: Card = 'deathCard'
const RUIN: Card = 'ruin'
const ABANDONED_MINE: Card = 'abandonedMine'

type Topic = AtLeastOnce<5 | 6 | 7 | 8> | Both<5> | 'trashingRuin' | 'trashingDeathCart'

abstract class DeathCart implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn.bind(this))

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7, 8),
      ...resultOfBoth5(t3, t4),
      ...resultOfAny(t3, t4, 'trashingRuin'),
      ...resultOfAny(t3, t4, 'trashingDeathCart'),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6, 7, 8),
      ...topicForBoth5(),
      trashingRuin: '廃墟を廃棄できる確率',
      trashingDeathCart: '死の荷車を廃棄することになる確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    let coin = sumOfCoin(hand)
    if (hand.includes(ABANDONED_MINE) && !hand.includes(DEATH_CART)) {
      coin++
    }
    const { additionalCoin, trashingRuin, trashingDeathCart } = this.processDeathCart(hand, coin)

    return { coin: coin + additionalCoin, trashingRuin, trashingDeathCart }
  }

  private processDeathCart(hand: Card[], coin: number) {
    if (hand.includes(DEATH_CART) && coin < 5) {
      if (hand.includes(RUIN) || hand.includes(ABANDONED_MINE)) {
        return { additionalCoin: 5, trashingRuin: true, trashingDeathCart: false }
      } else {
        return { additionalCoin: 5, trashingRuin: false, trashingDeathCart: true }
      }
    } else {
      return { additionalCoin: 0, trashingRuin: false, trashingDeathCart: false }
    }
  }
}

class DeathCartWithSilver extends DeathCart {
  title = () => '屋敷場かつ銀貨・死の荷車で廃墟は2枚とも廃村だった場合、4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(14, (factory, otherIndices) =>
      combination(otherIndices, 2).flatMap((ruins) =>
        permutation(difference(otherIndices, ruins), 2).map(([silver, deathCart]) =>
          factory.create((deck) => {
            deck[ruins[0]] = RUIN
            deck[ruins[0]] = RUIN
            deck[silver] = SILVER
            deck[deathCart] = DEATH_CART
          })
        )
      )
    )
  }
}

class DeathCartWithSilverAndMine extends DeathCart {
  title = () => '屋敷場かつ死の荷車・銀貨で廃墟は廃村と廃坑だった場合、4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(14, (factory, otherIndices) =>
      permutation(otherIndices, 4).map(([ruin, mine, deathCart, silver]) =>
        factory.create((deck) => {
          deck[ruin] = RUIN
          deck[mine] = ABANDONED_MINE
          deck[deathCart] = DEATH_CART
          deck[silver] = SILVER
        })
      )
    )
  }
}

class DeathCartOnly extends DeathCart {
  title = () => '屋敷場かつ死の荷車・パスで廃墟は2枚とも廃村だった場合、4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(13, (factory, otherIndices) =>
      combination(otherIndices, 2).flatMap((ruins) =>
        difference(otherIndices, ruins).map((deathCart) =>
          factory.create((deck) => {
            deck[ruins[0]] = RUIN
            deck[ruins[1]] = RUIN
            deck[deathCart] = DEATH_CART
          })
        )
      )
    )
  }
}

class DeathCartAndMine extends DeathCart {
  title = () => '屋敷場かつ死の荷車・パスで廃墟は廃村と廃坑だった場合、4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(13, (factory, otherIndices) =>
      permutation(otherIndices, 3).map(([ruin, mine, deathCart]) =>
        factory.create((deck) => {
          deck[ruin] = RUIN
          deck[mine] = ABANDONED_MINE
          deck[deathCart] = DEATH_CART
        })
      )
    )
  }
}

run(new DeathCartWithSilver(), new DeathCartWithSilverAndMine(), new DeathCartOnly(), new DeathCartAndMine())
