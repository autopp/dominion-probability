import { run } from '@/runner'
import { Card, COPPER, Result, Tactic } from '@/tactic'
import { resultOfAny, simpleDeckPattern, splitByNoDraw, withCombinationOfEstates } from '@/util'

type Topic = 'max5AndTrashingEstate' | 'copper4AndGoat'
const GOAT: Card = 'goat'

class Goat implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銅貨6枚・ヤギ1枚・屋敷3枚で2ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(10, (factory, otherIndices) =>
      otherIndices.map((goat) =>
        factory.create((deck) => {
          deck[goat] = GOAT
        })
      )
    )
  }
  splitToHands = splitByNoDraw
  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAny(t3, t4, 'max5AndTrashingEstate'),
      ...resultOfAny(t3, t4, 'copper4AndGoat'),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      max5AndTrashingEstate: '5金かつ屋敷を廃棄できる確率',
      copper4AndGoat: '銅貨4枚とヤギを引く確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    return {
      max5AndTrashingEstate: hand.every((c) => c === COPPER),
      copper4AndGoat: hand.includes(GOAT) && hand.filter((c) => c === COPPER).length === 4,
    }
  }
}

run(new Goat())
