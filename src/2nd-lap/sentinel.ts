import { run } from '@/runner'
import { ACTION, Card, COPPER, ESTATE, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  atLeastOnce5,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  sumOfCoin,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
} from '@/util'
import { permutation } from 'arubyray'

type TrashingEstates = `trashingEstates${1 | 2}`
type TrashingEstatesAndAtLeastOnce5 = `trashingEstates${1 | 2}AndAtLeaseOnce5`
type TrashingEstatesAndCost5InThirdDeck = `trashingEstates${1 | 2}AndCost5InThirdDeck`

type Topic =
  | AtLeastOnce<5 | 6>
  | TrashingEstates
  | TrashingEstatesAndAtLeastOnce5
  | 'cost5InThirdDeck'
  | TrashingEstatesAndCost5InThirdDeck

class Sentinel implements Tactic<[Card[], Card[], Card[]], Topic> {
  readonly title = () => '銀貨・Sentinel で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWithSilverAndAction()
      .map((deck) => {
        return permutation([...deck.slice(0, 5), ACTION], 3).map((rest) => [...deck, ...rest])
      })
      .flat()
  }

  splitToHands(deck: Card[]): [Card[], Card[], Card[]] {
    return [deck.slice(0, 5).sort(), deck.slice(5, 10).sort(), deck.slice(10, 15)]
  }
  readonly patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[], Card[]]): Result<Topic> {
    const t3 = this.simulateTurn(deck[0])
    let t4: typeof t3
    let trashingEstates: number

    if (t3.usingSentinel) {
      const choosed = this.chooseSentinel(deck[1])
      trashingEstates = choosed.trashingEstates
      t4 = this.simulateTurn([...choosed.rest, ...deck[2].slice(0, 2)])
    } else {
      t4 = this.simulateTurn(deck[1])
      trashingEstates = t4.usingSentinel ? this.chooseSentinel(deck[2]).trashingEstates : 0
    }

    const isAtLeastOnce5 = atLeastOnce5(t3, t4)
    const cost5InThirdDeck = isAtLeastOnce5 && !t4.usingSentinel

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      trashingEstates1: trashingEstates >= 1,
      trashingEstates2: trashingEstates === 2,
      trashingEstates1AndAtLeaseOnce5: trashingEstates >= 1 && isAtLeastOnce5,
      trashingEstates2AndAtLeaseOnce5: trashingEstates === 2 && isAtLeastOnce5,
      cost5InThirdDeck,
      trashingEstates1AndCost5InThirdDeck: trashingEstates >= 1 && cost5InThirdDeck,
      trashingEstates2AndCost5InThirdDeck: trashingEstates === 2 && cost5InThirdDeck,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnce5(),
      ...topicForAtLeastOnce6(false),
      trashingEstates1: '屋敷を廃棄できる確率',
      trashingEstates2: '屋敷を2枚廃棄できる確率',
      trashingEstates1AndAtLeaseOnce5: '屋敷を廃棄しつつ一度でも5金以上が出る確率',
      trashingEstates2AndAtLeaseOnce5: '屋敷を2枚廃棄しつつ一度でも5金以上が出る確率',
      cost5InThirdDeck: '5金以上のカードが山札3周目に入る確率',
      trashingEstates1AndCost5InThirdDeck: '屋敷を廃棄しつつ5金以上のカードが山札3周目に入る確率',
      trashingEstates2AndCost5InThirdDeck: '屋敷1枚を廃棄しつつ5金以上のカードが山札3周目に入る確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    const coin = sumOfCoin(hand)
    const usingSentinel = hand.includes(ACTION)
    return { coin, usingSentinel }
  }

  private chooseSentinel(pile: Card[]): { trashingEstates: number; rest: Card[] } {
    const sorted = [...pile].sort((a, b) => {
      if (a === ESTATE) {
        return -1
      } else if (b === ESTATE) {
        return 1
      } else if (a === COPPER) {
        return -1
      } else {
        return 1
      }
    })

    return { trashingEstates: sorted.slice(0, 2).filter((c) => c === ESTATE).length, rest: sorted.slice(2, 5) }
  }
}

run(new Sentinel())
