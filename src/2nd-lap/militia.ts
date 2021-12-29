import { run } from '@/runner'
import { Card, COPPER, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithDoubleSilver,
  resultOfAtLeastOnces,
  resultOfBoth5,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
  topicForBoth5,
} from '@/util'
import { take } from 'arubyray'

type Topic = AtLeastOnce<5 | 6 | 7> | Both<5> | 'lost5' | 'lost6'
type Options = { attackedT3: boolean; attackedT4: boolean }

abstract class Militia implements Tactic<[Card[], Card[]], Topic, Options> {
  readonly title = () => '屋敷場かつ銀貨・司教で4ターン目までに……'

  genDecks = genDecksWithDoubleSilver
  splitToHands = splitByNoDraw
  abstract patternsOfDeck(): { factor: number; options: Options }[]

  simulate(deck: [Card[], Card[]], { attackedT3, attackedT4 }: Options): Result<Topic> {
    const [hand3, hand4] = deck
    const t3 = this.simulateTurn(hand3, attackedT3)
    const t4 = this.simulateTurn(hand4, attackedT4)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      ...resultOfBoth5(t3, t4),
      ...this.resultOfLost(t3, t4, 5),
      ...this.resultOfLost(t3, t4, 6),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForAtLeastOnce7(false),
      ...topicForBoth5(),
      lost5: '5金以上の手札を5金未満にされる確率',
      lost6: '6金以上の手札を6金未満にされる確率',
    }
  }

  private simulateTurn(hand: Card[], attacked: boolean) {
    const coinOriginal = sumOfCoin(hand)
    const coin = attacked ? sumOfCoin(this.discard(hand)) : coinOriginal

    return { coin, coinOriginal }
  }

  private discard(hand: Card[]) {
    return take(
      [...hand].sort((a, b) => this.cardValueOf(b) - this.cardValueOf(a)),
      3
    )
  }

  private cardValueOf(card: Card) {
    return card === COPPER ? 1 : card === SILVER ? 2 : 0
  }

  private resultOfLost<N extends number>(
    t3: { coin: number; coinOriginal: number },
    t4: { coin: number; coinOriginal: number },
    coin: N
  ): { [t in `lost${N}`]: boolean } {
    const losted = (t3.coinOriginal >= coin && t3.coin < coin) || (t4.coinOriginal >= coin && t4.coin < coin)

    return { [`lost${coin}`]: losted } as { [t in `lost${N}`]: boolean }
  }
}

class MilitiaFirstPlayer extends Militia {
  readonly title = () => '2人戦の先手番で自分も相手も銀貨・民兵の場合、4ターン目までに……'
  readonly patternsOfDeck = () => [
    { factor: 7, options: { attackedT3: false, attackedT4: false } },
    { factor: 5, options: { attackedT3: false, attackedT4: true } },
  ]
}

class MilitiaSecondPlayer extends Militia {
  readonly title = () => '2人戦の後手番で自分も相手も銀貨・民兵の場合、4ターン目までに……'
  readonly patternsOfDeck = () => [
    { factor: 2, options: { attackedT3: false, attackedT4: false } },
    { factor: 5, options: { attackedT3: true, attackedT4: false } },
    { factor: 5, options: { attackedT3: false, attackedT4: true } },
  ]
}

run(new MilitiaFirstPlayer(), new MilitiaSecondPlayer())
