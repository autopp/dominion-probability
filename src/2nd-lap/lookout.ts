import { run } from '@/runner'
import { ACTION, Card, COPPER, ESTATE, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  atLeastOnce5 as calcAtLeastOnce5,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  sumOfCoin,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForTrashingEstate,
  topicForTrashingEstateAndAtLeastOnce5,
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
} from '@/util'

type Topic =
  | AtLeastOnce<5 | 6>
  | TrashingEstate
  | TrashingEstateAndAtLeastOnce<5>
  | 'cost5InThirdDeck'
  | 'trashingEstateAndCost5InThirdDeck'

type Options = { lookBought: boolean }

class Lookout implements Tactic<Card[], Topic, Options> {
  readonly title = () => '銀貨・見張りで4ターン目までに……'

  genDecks = genDecksWithSilverAndAction
  splitToHands = (deck: Card[]) => deck
  patternsOfDeck = () => [
    { factor: 5, options: { lookBought: false } },
    { factor: 1, options: { lookBought: true } },
  ]

  simulate(deck: Card[], { lookBought }: Options): Result<Topic> {
    deck.push(lookBought ? SILVER : deck[0])
    const t3 = this.simulateTurn(deck)
    const rest = t3.trash ? [t3.top, ...deck.slice(8, 12)] : deck.slice(6, 13)
    const t4 = this.simulateTurn(rest as Card[])

    const trashingEstate = t3.trash === ESTATE || t4.trash === ESTATE
    const atLeastOnce5 = calcAtLeastOnce5(t3, t4)
    const cost5InThirdDeck = atLeastOnce5 && !t4.trash

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      trashingEstate,
      trashingEstateAndAtLeastOnce5: trashingEstate && atLeastOnce5,
      cost5InThirdDeck,
      trashingEstateAndCost5InThirdDeck: trashingEstate && cost5InThirdDeck,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnce5(),
      ...topicForAtLeastOnce6(false),
      ...topicForTrashingEstate(),
      ...topicForTrashingEstateAndAtLeastOnce5(),
      cost5InThirdDeck: '5金以上のカードが山札3周目に入る確率',
      trashingEstateAndCost5InThirdDeck: '屋敷を廃棄しつつ5金以上のカードが山札3周目に入る確率',
    }
  }

  private simulateTurn(deck: Card[]) {
    const hand = deck.slice(0, 5)
    const coin = sumOfCoin(hand)
    const [trash, discard, top] = hand.includes(ACTION)
      ? this.chooseTrashing(deck.slice(5, 8))
      : ([undefined, undefined, undefined] as const)

    return { coin, trash, discard, top }
  }

  private chooseTrashing(cards: Card[]) {
    const sorted = [...cards]
    return sorted.sort((a, b) => this.sortOrderOf(a) - this.sortOrderOf(b))
  }

  private sortOrderOf(card: Card) {
    switch (card) {
      case ESTATE:
        return 0
      case COPPER:
        return 1
      default:
        return 2
    }
  }
}

run(new Lookout())
