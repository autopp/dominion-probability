import { run } from '@/runner'
import { Card, COPPER, Result, Tactic } from '@/tactic'
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

type Topic = AtLeastOnce<5 | 6 | 7> | Both<5> | 'lost5' | 'lost6'
type DeckOptions = { discardingT3: boolean; discardingT4: boolean }

abstract class Cutpurse implements Tactic<[Card[], Card[]], Topic, DeckOptions> {
  abstract title(): string
  abstract patternsOfDeck(): { factor: number; options: DeckOptions }[]

  genDecks = genDecksWithDoubleSilver
  splitToHands = splitByNoDraw

  simulate(deck: [Card[], Card[]], options: DeckOptions): Result<Topic> {
    const [h3, h4] = deck
    const t3 = this.simulateTurn(h3, options.discardingT3)
    const t4 = this.simulateTurn(h4, options.discardingT4)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      ...resultOfBoth5(t3, t4),
      ...this.resultOfLosts(t3, t4, 5, 6),
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

  private simulateTurn(hand: Card[], discarding: boolean) {
    const coinOriginal = sumOfCoin(hand)
    const coin = discarding && hand.includes(COPPER) ? coinOriginal - 1 : coinOriginal
    return { coin, coinOriginal }
  }

  private resultOfLosts<N extends number>(
    t3: { coin: number; coinOriginal: number },
    t4: { coin: number; coinOriginal: number },
    ...coins: N[]
  ): { [t in `lost${N}`]: boolean } {
    return Object.assign(
      {},
      ...coins.map((coin) => ({
        [`lost${coin}`]: (t3.coinOriginal >= coin && t3.coin < coin) || (t4.coinOriginal >= coin && t4.coin < coin),
      }))
    )
  }
}

class CutpurseFirstPlayer extends Cutpurse {
  title = () => '2人戦の先手番で自分も相手も銀貨・巾着切りの場合、4ターン目までに……'

  patternsOfDeck = () => [
    { factor: 7, options: { discardingT3: false, discardingT4: false } },
    { factor: 5, options: { discardingT3: false, discardingT4: true } },
  ]
}

class CutpurseSecondPlayer extends Cutpurse {
  title = () => '2人戦の後手番で自分も相手も銀貨・巾着切りの場合、4ターン目までに……'

  patternsOfDeck = () => [
    { factor: 2, options: { discardingT3: false, discardingT4: false } },
    { factor: 5, options: { discardingT3: true, discardingT4: false } },
    { factor: 5, options: { discardingT3: false, discardingT4: true } },
  ]
}

run(new CutpurseFirstPlayer(), new CutpurseSecondPlayer())
