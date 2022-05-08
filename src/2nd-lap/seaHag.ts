import { run } from '@/runner'
import { Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  genDecksWithDoubleSilver,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth5,
  sumOfCoin,
  topicForAtLeastOnces,
  topicForBoth5,
} from '@/util'
import { drop } from 'arubyray'

type Topic = AtLeastOnce<5 | 6> | 'lost5' | 'lost6'
type Options = { attackedT4: boolean }

abstract class SeaHag implements Tactic<[Card[], Card[]], Topic, Options> {
  abstract title(): string
  abstract genDecks(): Card[][]

  splitToHands(deck: Card[]): [Card[], Card[]] {
    return [deck.slice(0, 5).sort(), deck.slice(5, 10)]
  }

  patternsOfDeck(): { factor: number; options: Options }[] {
    return [
      { factor: 7, options: { attackedT4: false } },
      { factor: 5, options: { attackedT4: true } },
    ]
  }

  simulate(deck: [Card[], Card[]], { attackedT4 }: Options): Result<Topic> {
    const [hand3, hand4] = deck
    const t3 = this.simulateTurn(hand3, false)
    const t4 = this.simulateTurn(hand4, attackedT4)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6),
      ...resultOfBoth5(t3, t4),
      ...this.resultOfLost(t3, t4, 5),
      ...this.resultOfLost(t3, t4, 6),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForBoth5(),
      lost5: '5金以上の手札を5金未満にされる確率',
      lost6: '6金以上の手札を6金未満にされる確率',
    }
  }

  private simulateTurn(hand: Card[], attacked: boolean) {
    const coinOriginal = sumOfCoin(hand)
    const coin = attacked ? sumOfCoin(drop(hand, 1)) : coinOriginal

    return { coin, coinOriginal }
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

class SeaHagWithSeaHag extends SeaHag {
  readonly title = () => '2人戦の後手番で自分も相手も銀貨・海の妖婆の場合、4ターン目までに……'

  genDecks = genDecksWithSilverAndAction
}

class SeaHagWithSilver extends SeaHag {
  readonly title = () => '2人戦の後手番で自分が銀貨・銀貨、相手が銀貨・海の妖婆の場合、4ターン目までに……'

  genDecks = genDecksWithDoubleSilver
}

run(new SeaHagWithSeaHag(), new SeaHagWithSilver())
