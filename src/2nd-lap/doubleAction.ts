import { run } from '@/runner'
import { Card, Result, Tactic } from '@/tactic'
import {
  any,
  AtLeastOnce,
  Both,
  genDecksWithDouble,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnces,
  topicForBoth5,
  withCombinationOfEstates,
} from '@/util'
import { count, permutation } from 'arubyray'

type Topic = AtLeastOnce<5 | 6> | Both<5> | 'bothAction' | 'doubled'

const DRAW_ACTION: Card = 'draw'
const COIN_ACTION: Card = 'coin'
const NECROPOLIS: Card = 'necropolis'

abstract class DoubleAction<Deck> implements Tactic<Deck, Topic> {
  abstract title(): string

  abstract genDecks(): Card[][]
  abstract splitToHands(deck: Card[]): Deck
  patternsOfDeck = simpleDeckPattern

  abstract simulate(deck: Deck): Result<Topic>

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForBoth5(),
      bothAction: 'アクションを両方プレイできる確率',
      doubled: 'アクションが事故る確率',
    }
  }
}

class DoubleCoinAction extends DoubleAction<[Card[], Card[]]> {
  title = () => '屋敷場で2金を出すターミナルアクション2枚を獲得した場合、4ターン目までに……'
  genDecks = () => genDecksWithDouble(COIN_ACTION)
  splitToHands = splitByNoDraw
  simulate(deck: [Card[], Card[]]) {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      ...resultOfBoth5(t3, t4),
      bothAction: t3.played + t4.played === 2,
      doubled: any(t3, t4, 'doubled'),
    }
  }

  private simulateTurn(hand: Card[]) {
    let coin = sumOfCoin(hand)
    const hasNecropolis = hand.includes(NECROPOLIS)
    const coinActions = count(hand, (c) => c === COIN_ACTION)
    const doubled = coinActions === 2 && !hasNecropolis
    const played = doubled ? 1 : coinActions
    coin += played * 2

    return { coin, played, doubled }
  }
}

class CoinAndDrawAction extends DoubleAction<Card[]> {
  title = () =>
    '屋敷場で2金を出すターミナルアクション1枚と2ドローするターミナルアクション1枚を獲得した場合、4ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(12, (factory, otherIndices) =>
      permutation(otherIndices, 2).map(([coin, draw]) =>
        factory.create((deck) => {
          deck[coin] = COIN_ACTION
          deck[draw] = DRAW_ACTION
        })
      )
    )
  }

  splitToHands = (deck: Card[]): Card[] => deck

  simulate(deck: Card[]) {
    const t3 = this.simulateTurn(deck.slice(0, 5), deck.slice(5, 7))
    const [hand4, drawn4] = t3.drew ? [deck.slice(7, 12), []] : [deck.slice(5, 10), deck.slice(10, 12)]
    const t4 = this.simulateTurn(hand4, drawn4)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      ...resultOfBoth5(t3, t4),
      bothAction: t3.played + t4.played === 2,
      doubled: any(t3, t4, 'doubled'),
    }
  }

  private simulateTurn(hand: Card[], drawn: Card[]) {
    const useDraw = this.useDraw(hand)
    const allHand = useDraw ? [...hand, ...drawn] : hand
    const doubled = this.handDoubled(hand, allHand)

    let coin = sumOfCoin(allHand)
    if (allHand.includes(COIN_ACTION) && (!doubled || !useDraw)) {
      coin += 2
    }
    const played = doubled ? 1 : count(allHand, (card) => card === COIN_ACTION || card === DRAW_ACTION)

    return { coin, drew: useDraw, played, doubled }
  }

  private useDraw(hand: Card[]) {
    return (
      hand.includes(DRAW_ACTION) && (!hand.includes(COIN_ACTION) || hand.includes(NECROPOLIS) || sumOfCoin(hand) < 3)
    )
  }

  private handDoubled(hand: Card[], allHand: Card[]) {
    return !hand.includes(NECROPOLIS) && hand.includes(DRAW_ACTION) && allHand.includes(COIN_ACTION)
  }
}

class DoubleCoinActionWithNecropolis extends DoubleCoinAction {
  title = () => '避難所場で2金を出すターミナルアクション2枚を獲得した場合、4ターン目までに……'

  genDecks = () =>
    withCombinationOfEstates(12, 2, (factory, otherIndices) =>
      permutation(otherIndices, 3).map(([necropolis, coin1, coin2]) =>
        factory.create((deck) => {
          deck[necropolis] = NECROPOLIS
          deck[coin1] = COIN_ACTION
          deck[coin2] = COIN_ACTION
        })
      )
    )
}

class CoinAndDrawActionWithNecropolis extends CoinAndDrawAction {
  title = () =>
    '避難所場で2金を出すターミナルアクション1枚と2ドローするターミナルアクション1枚を獲得した場合、4ターン目までに……'

  genDecks = () =>
    withCombinationOfEstates(12, 2, (factory, otherIndices) =>
      permutation(otherIndices, 3).map(([necropolis, coin, draw]) =>
        factory.create((deck) => {
          deck[necropolis] = NECROPOLIS
          deck[coin] = COIN_ACTION
          deck[draw] = DRAW_ACTION
        })
      )
    )
}

console.log(new CoinAndDrawAction().genDecks().length)

run(
  new DoubleCoinAction(),
  new CoinAndDrawAction(),
  new DoubleCoinActionWithNecropolis(),
  new CoinAndDrawActionWithNecropolis()
)
