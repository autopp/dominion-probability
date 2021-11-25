import { run } from '@/runner'
import { Card, ESTATE, GOLD, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce5,
  withCombinationOfEstates,
} from '@/util'

type Topic = AtLeastOnce<5> | 'trashingAllEstate'

abstract class Cathedral implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]

  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5),
      trashingAllEstate: t3.trashingEstate && t4.trashingEstate,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnce5(),
      trashingAllEstate: '両ターン共に屋敷を廃棄できる確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    let coin = sumOfCoin(hand)
    const trashingEstate = hand.includes(ESTATE)
    if (!trashingEstate) {
      coin -= 1
    }

    return { coin, trashingEstate }
  }
}

class CathedralSilver extends Cathedral {
  title = () => '大聖堂・銀貨で4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(10, 2, (factory, otherIndices) =>
      otherIndices.map((silver) =>
        factory.create((deck) => {
          deck[silver] = SILVER
        })
      )
    )
  }
}

class SilverCathedral extends Cathedral {
  title = () => '銀貨・大聖堂で4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(11, (factory, otherIndices) =>
      otherIndices.map((silver) =>
        factory.create((deck) => {
          deck[silver] = SILVER
        })
      )
    )
  }
}

class CathedralGold extends Cathedral {
  title = () => '大聖堂・金貨（あるいは石切場など）で4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(10, 2, (factory, otherIndices) =>
      otherIndices.map((gold) =>
        factory.create((deck) => {
          deck[gold] = GOLD
        })
      )
    )
  }
}

class GoldCathedral extends Cathedral {
  title = () => '金貨（あるいは石切り場など）・大聖堂で4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(11, (factory, otherIndices) =>
      otherIndices.map((gold) =>
        factory.create((deck) => {
          deck[gold] = GOLD
        })
      )
    )
  }
}

run(new CathedralSilver(), new SilverCathedral(), new CathedralGold(), new GoldCathedral())
