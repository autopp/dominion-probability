import { run } from '@/runner'
import { Card, Result, SILVER, Tactic } from '@/tactic'
import { genDecksWithDoubleSilver, withCombinationOfEstates } from '@/util'

type Topic = 'exiling'
type DeckOptions = { attackedT3: boolean; attackedT4: boolean }

abstract class Cardinal implements Tactic<[Card[], Card[]], Topic, DeckOptions> {
  abstract title(): string
  abstract genDecks(): Card[][]

  splitToHands(deck: Card[]): [Card[], Card[]] {
    return [deck.slice(5, 10), deck.slice(10, 12).sort()]
  }

  patternsOfDeck(): { factor: number; options: DeckOptions }[] {
    return [
      { factor: 2, options: { attackedT3: false, attackedT4: false } },
      { factor: 5, options: { attackedT3: true, attackedT4: false } },
      { factor: 5, options: { attackedT3: false, attackedT4: true } },
    ]
  }

  simulate(deck: [Card[], Card[]], options: DeckOptions): Result<Topic> {
    const [hand4, bottom] = deck

    return {
      exiling:
        (options.attackedT3 && hand4.slice(0, 2).includes(SILVER)) || (options.attackedT4 && bottom.includes(SILVER)),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      exiling: '相手のカードを追放できる確率',
    }
  }
}

class CardinalFourTree extends Cardinal {
  title = () => '2人戦の先手番で自分が銀貨・枢機卿、相手が4-3の場合、4ターン目までに……'
  genDecks = genDecksWithDoubleSilver
}

class CardinalFiveTwo extends Cardinal {
  title = () => '2人戦の先手番で自分が銀貨・枢機卿、相手が5-2の場合、4ターン目までに……'
  genDecks(): Card[][] {
    return withCombinationOfEstates(12, 4, (factory, otherIndices) =>
      otherIndices.map((silver) =>
        factory.create((deck) => {
          deck[silver] = SILVER
        })
      )
    )
  }
}

run(new CardinalFourTree(), new CardinalFiveTwo())
