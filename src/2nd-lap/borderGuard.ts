import { run } from '@/runner'
import { ACTION, Card, COPPER, ESTATE, Result, SILVER, Tactic } from '@/tactic'
import {
  all,
  any,
  AtLeastOnce,
  Both,
  BothAndAtLeastOnce,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnce5,
  resultOfAtLeastOnces,
  resultOfBoth,
  resultOfBoth5,
  resultOfBothAndAtLeastOnce,
  resultOfTrashingEstate,
  resultOfTrashingEstateAndAtLeastOnce5,
  simpleDeckPattern,
  simulateTurnWithBaseCoinOnly,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
  topicForBoth5,
  topicForBothAndAtLeastOnce,
  topicForTrashingEstate,
  topicForTrashingEstateAndAtLeastOnce5,
  trashingEstate,
  TrashingEstate,
  TrashingEstateAndAtLeastOnce,
  withCombinationOfEstates,
} from '@/util'
import { permutation } from 'arubyray'

const BG: Card = 'borderGuard'

abstract class BorderGuard<Topic extends string> implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract simulate(deck: [string[], string[]], options: Record<string, unknown>): Result<Topic>
  abstract topics(): { [k in Topic]: string }
  abstract partner(): Card
  abstract chooseBorderGuard(handAndRevealed: Card[]): Card[]

  genDecks() {
    return withCombinationOfEstates(12, (factory, otherIndices) =>
      permutation(otherIndices, 2).map(([bg, p]) =>
        factory.create((deck) => {
          deck[bg] = BG
          deck[p] = this.partner()
        })
      )
    )
  }

  splitToHands(deck: Card[]): [Card[], Card[]] {
    const i = deck.indexOf(BG)
    if (i < 5) {
      return [this.chooseBorderGuard(deck.slice(0, 7)).sort(), deck.slice(7, 12).sort()]
    }

    if (i < 10) {
      return [deck.slice(0, 5).sort(), this.chooseBorderGuard(deck.slice(5, 12)).sort()]
    }

    return [deck.slice(0, 5).sort(), deck.slice(5, 10).sort()]
  }

  patternsOfDeck = simpleDeckPattern

  chooseOne(revealed: Card[], order: Card[]): Card {
    const found = order.find((card) => revealed.includes(card))

    if (found === undefined) {
      throw new Error(`revealed: ${revealed}, order: ${order}`)
    }

    return found
  }
}

type WithSilverTopic = AtLeastOnce<5 | 6>
class BorderGuardWithSilver extends BorderGuard<WithSilverTopic> {
  title = () => '国境警備隊・銀貨で4ターン目までに……'
  partner = () => SILVER

  chooseBorderGuard(handAndRevealed: Card[]) {
    const revealed = handAndRevealed.slice(5, 7)
    const hand = handAndRevealed.slice(0, 5)
    const choice = this.chooseOne(revealed, [SILVER, COPPER, ESTATE])
    return [...hand, choice]
  }

  simulate(deck: [Card[], Card[]]): Result<WithSilverTopic> {
    const [t3, t4] = deck.map(simulateTurnWithBaseCoinOnly)

    return resultOfAtLeastOnces(t3, t4, 5, 6)
  }

  topics(): { [t in WithSilverTopic]: string } {
    return {
      ...topicForAtLeastOnce5(),
      ...topicForAtLeastOnce6(false),
    }
  }
}

const SALVAGER = 'salvager'
type WithSalvagerTopic = AtLeastOnce<5> | TrashingEstate | TrashingEstateAndAtLeastOnce<5> | 'over4Coin2Buy'
class BorderGuardWithSalvager extends BorderGuard<WithSalvagerTopic> {
  title = () => '国境警備隊・引揚水夫で4ターン目までに……'
  partner = () => SALVAGER

  chooseBorderGuard(handAndRevealed: Card[]) {
    const revealed = handAndRevealed.slice(5, 7)
    const hand = handAndRevealed.slice(0, 5)
    const choice =
      hand.includes(SALVAGER) && !hand.includes(ESTATE)
        ? this.chooseOne(revealed, [ESTATE, SILVER, COPPER])
        : !hand.includes(SALVAGER) && hand.includes(ESTATE)
        ? this.chooseOne(revealed, [SALVAGER, SILVER, COPPER, ESTATE])
        : this.chooseOne(revealed, [SILVER, COPPER, ESTATE, SALVAGER])
    return [...hand, choice]
  }

  simulate(deck: [Card[], Card[]]): Result<WithSalvagerTopic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnce5(t3, t4),
      ...resultOfTrashingEstate(t3, t4),
      ...resultOfTrashingEstateAndAtLeastOnce5(t3, t4),
      over4Coin2Buy: any(t3, t4, 'over4Coin2Buy'),
    }
  }

  topics(): { [t in WithSalvagerTopic]: string } {
    return {
      ...topicForAtLeastOnce5(),
      ...topicForTrashingEstate(),
      ...topicForTrashingEstateAndAtLeastOnce5(),
      over4Coin2Buy: '4金以上2購入が出る確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    let coin = sumOfCoin(hand)
    let trashingEstate = false
    if (hand.includes(SALVAGER) && hand.includes(ESTATE)) {
      coin += 2
      trashingEstate = true
    }

    const over4Coin2Buy = trashingEstate && coin >= 4
    return { coin, trashingEstate, over4Coin2Buy }
  }
}

const BARON = 'baron'
type WithBaronTopic = AtLeastOnce<5 | 6 | 7> | Both<5> | BothAndAtLeastOnce<5, 6> | 'neet'
class BorderGuardWithBaron extends BorderGuard<WithBaronTopic> {
  title = () => '国境警備隊・男爵で4ターン目までに……'
  partner = () => BARON

  chooseBorderGuard(handAndRevealed: Card[]) {
    const revealed = handAndRevealed.slice(5, 7)
    const hand = handAndRevealed.slice(0, 5)
    const choice =
      hand.includes(BARON) && !hand.includes(ESTATE)
        ? this.chooseOne(revealed, [ESTATE, SILVER, COPPER])
        : !hand.includes(BARON) && hand.includes(ESTATE)
        ? this.chooseOne(revealed, [BARON, SILVER, COPPER, ESTATE])
        : this.chooseOne(revealed, [SILVER, COPPER, ESTATE, BARON])
    return [...hand, choice]
  }

  simulate(deck: [Card[], Card[]]): Result<WithBaronTopic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      ...resultOfBoth5(t3, t4),
      ...resultOfBothAndAtLeastOnce(t3, t4, 5, 6),
      neet: all(t3, t4, 'neet'),
    }
  }

  topics() {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForAtLeastOnce7(false),
      ...topicForBoth5(),
      ...topicForBothAndAtLeastOnce(5, 6, false),
      neet: '男爵が沈む、あるいはニート男爵になる確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    let coin = sumOfCoin(hand)
    let neet = true
    if (hand.includes(BARON) && hand.includes(ESTATE)) {
      coin += 4
      neet = false
    }

    return { coin, neet }
  }
}

run(new BorderGuardWithSilver(), new BorderGuardWithSalvager(), new BorderGuardWithBaron())
