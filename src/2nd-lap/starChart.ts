import { run } from '@/runner'
import { Card, COPPER, ESTATE, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce6,
  topicForAtLeastOnces,
  topicForBoth5,
} from '@/util'
import { permutation } from 'arubyray'

type Topic = AtLeastOnce<5 | 6> | Both<5>

class StarChart implements Tactic<[Card[], Card[]], Topic> {
  title = () => '銀貨・星図で銀貨をトップに乗せた場合、4ターン目までに……'

  genDecks(): Card[][] {
    const indices: number[] = []
    for (let i = 1; i < 11; i++) {
      indices.push(i)
    }

    return permutation(indices, 3).map((estates) => {
      const deck: Card[] = new Array(11)
      for (let i = 1; i < 11; i++) {
        deck[i] = COPPER
      }
      deck[0] = SILVER
      deck[estates[0]] = ESTATE
      deck[estates[1]] = ESTATE
      deck[estates[2]] = ESTATE
      return deck
    })
  }

  splitToHands = splitByNoDraw

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      ...resultOfBoth5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5),
      ...topicForAtLeastOnce6(false),
      ...topicForBoth5(),
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand) }
  }
}

run(new StarChart())
