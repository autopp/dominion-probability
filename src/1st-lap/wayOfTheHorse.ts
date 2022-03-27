import { run } from '@/runner'
import { ACTION, Card, Result, Tactic } from '@/tactic'
import { simpleDeckPattern, splitByDraw, sumOfCoin, withCombinationOfEstates } from '@/util'

type Topic = `coin${4 | 5 | 6}AtT1`

class WayOfThePig implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '避難所場で馬の習性もしくはカワウソの習性がある時、2ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(10, 2, (factory, otherIndices) =>
      otherIndices.map((necropolis) =>
        factory.create((deck) => {
          deck[necropolis] = ACTION
        })
      )
    )
  }
  splitToHands = (deck: Card[]): [Card[], Card[]] => splitByDraw(deck, 2)
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const hand1 = deck[0]

    return {
      coin4AtT1: sumOfCoin(hand1) >= 4 && hand1.includes(ACTION),
      coin5AtT1: sumOfCoin(hand1) >= 5 && hand1.includes(ACTION),
      coin6AtT1: sumOfCoin(hand1) >= 6 && hand1.includes(ACTION),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      coin4AtT1: '1ターン目にリシャッフルしつつ4金以上が出る確率',
      coin5AtT1: '1ターン目にリシャッフルしつつ5金以上が出る確率',
      coin6AtT1: '1ターン目にリシャッフルしつつ6金が出る確率',
    }
  }
}

run(new WayOfThePig())
