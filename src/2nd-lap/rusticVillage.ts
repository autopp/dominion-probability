import { run } from '@/runner'
import { ACTION, Card, COPPER, ESTATE, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  sumOfCoin,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForBoth5,
} from '@/util'

type Topic = AtLeastOnce<5 | 6> | Both<5>

abstract class RusticVillage implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string

  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const action = deck.findIndex((card) => card === ACTION)

    if (action < 5) {
      const t3BeforeDiscarding = deck.slice(0, 6)
      const estatesInHand = t3BeforeDiscarding.filter((card) => card === ESTATE).length

      if (estatesInHand >= this.minimumNumberOfDiscardingEstate() && sumOfCoin(t3BeforeDiscarding) < 5) {
        const totalDiscardingCopper = Math.max(2 - estatesInHand, 0)

        const t3 = deck.slice(0, 7)
        let discardingCopper = 0
        for (let i = 0; i < totalDiscardingCopper; i++) {
          if (t3[1] === COPPER) {
            t3[i] = ESTATE
            // console.log('discard copper')
            discardingCopper++
          }

          if (discardingCopper >= totalDiscardingCopper) {
            break
          }
        }
        return [t3, deck.slice(7, 12)]
      } else {
        return [deck.slice(0, 6), deck.slice(6, 11)]
      }
    } else if (action < 10) {
      return deck[11] === ESTATE ? [deck.slice(0, 5), deck.slice(5, 11)] : [deck.slice(0, 5), deck.slice(5, 12)]
    } else {
      return [deck.slice(0, 5), deck.slice(5, 10)]
    }
  }
  patternsOfDeck = simpleDeckPattern

  abstract minimumNumberOfDiscardingEstate(): number

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map((hand) => ({
      coin: sumOfCoin(hand),
    }))

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      ...resultOfBoth5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnce5(),
      ...topicForAtLeastOnce6(false),
      ...topicForBoth5(),
    }
  }
}

class RusticVillageDiscardingEstateOnly extends RusticVillage {
  title() {
    return '銀貨・田舎の村で3ターン目は屋敷2枚しか捨てない場合、4ターン目までに……'
  }

  minimumNumberOfDiscardingEstate() {
    return 2
  }
}

class RusticVillageDiscardingOneCopper extends RusticVillage {
  title() {
    return '銀貨・田舎の村で3ターン目は屋敷1枚以上なら捨てる場合、4ターン目までに……'
  }

  minimumNumberOfDiscardingEstate() {
    return 1
  }
}

run(new RusticVillageDiscardingEstateOnly(), new RusticVillageDiscardingOneCopper())
