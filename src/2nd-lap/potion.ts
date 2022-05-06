import { run } from '@/runner'
import { ACTION, Card, COPPER, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  genDecksWith,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  splitByDraw,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnces,
} from '@/util'

type Topic = AtLeastOnce<5 | 6> | `potion${2 | 3}` | `potion${2 | 3}AndAtLeastOnce5`
type TurnSummary = { coin: number; potion: boolean }
const POTION: Card = 'potion'

abstract class Potion implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]
  abstract splitToHands(deck: Card[]): [Card[], Card[]]

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [t3, t4] = deck.map(this.simulateTurn)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      potion2: this.anyWithPotion(t3, t4, 2),
      potion3: this.anyWithPotion(t3, t4, 3),
      potion2AndAtLeastOnce5: this.withPotionAnd5(t3, t4, 2),
      potion3AndAtLeastOnce5: this.withPotionAnd5(t3, t4, 3),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      potion2: '2金 + ポーションを出せる確率',
      potion2AndAtLeastOnce5: '2金 + ポーションと5金の両方を出せる確率',
      potion3: '3金 + ポーションを出せる確率',
      potion3AndAtLeastOnce5: '3金 + ポーションと5金の両方を出せる確率',
    }
  }

  private simulateTurn(hand: Card[]) {
    return { coin: sumOfCoin(hand), potion: hand.includes(POTION) }
  }

  private withPotion(t: TurnSummary, coin: number) {
    return t.coin >= coin && t.potion
  }

  private anyWithPotion(t3: TurnSummary, t4: TurnSummary, coin: number) {
    return [t3, t4].some((t) => this.withPotion(t, coin))
  }

  private withPotionAnd5(t3: TurnSummary, t4: TurnSummary, coin: number) {
    return [
      [t3, t4],
      [t4, t3],
    ].some(([t1, t2]) => this.withPotion(t1, coin) && t2.coin >= 5)
  }
}

class PotionWithSilver extends Potion {
  readonly title = () => '銀貨・ポーションで4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWith(SILVER, POTION)
  }

  splitToHands = splitByNoDraw
}

class PotionWithCopper extends Potion {
  readonly title = () => '銅貨・ポーションで4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWith(COPPER, POTION)
  }

  splitToHands = splitByNoDraw
}

class PotionWithDraw extends Potion {
  readonly title = () => 'ポーション・2ドローカード（堀など）で4ターン目までに……'

  genDecks(): Card[][] {
    return genDecksWith(ACTION, POTION)
  }

  splitToHands(deck: Card[]) {
    return splitByDraw(deck, 2)
  }
}

run(new PotionWithSilver(), new PotionWithCopper(), new PotionWithDraw())
