import { run } from '@/runner'
import { Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  splitByDraw,
  sumOfCoin,
  topicForBoth5,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7> | Both<5> | 'freeChoice'

class SilkMarchant implements Tactic<[Card[], Card[]], Topic> {
  readonly title = () => '銀貨・絹商人で4ターン目までに……'

  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]) {
    return splitByDraw(deck, 2)
  }

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      both5: Math.max(t3.coin, t4.coin) == 5 && t3.coin + t4.coin === 9,
      freeChoice: t3.hand === 7 && t3.coin > 4,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      atLeastOnce5: '一度でも6金を出せる確率',
      atLeastOnce6: '一度でも7金を出せる確率',
      atLeastOnce7: '一度でも8金を出せる確率',
      ...topicForBoth5(false),
      freeChoice: '3Tの時点で5-5か6-4を自由に選べる確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand), hand: hand.length }
  }
}

run(new SilkMarchant())
