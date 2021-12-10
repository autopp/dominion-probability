import { run } from '@/runner'
import { ACTION, Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  sumOfCoin,
  topicForAtLeastOnce7,
  topicForAtLeastOnces,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7> | 'duration' | 'skip'
type DeckOptions = { enchantressedT3: boolean; enchantressedT4: boolean }

abstract class Enchantress implements Tactic<Card[], Topic, DeckOptions> {
  abstract title(): string

  genDecks = genDecksWithSilverAndAction
  splitToHands = (deck: Card[]) => deck
  abstract patternsOfDeck(): { factor: number; options: DeckOptions }[]

  simulate(deck: Card[], options: DeckOptions): Result<Topic> {
    const [hand3, hand4, duration, skip] = this.deconstructDeck(deck, options)

    const t3 = { coin: sumOfCoin(hand3) }
    const t4 = { coin: sumOfCoin(hand4) }

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      duration,
      skip,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      ...topicForAtLeastOnce7(false),
      duration: '女魔術師を持続させることができる確率',
      skip: '女魔術師がキャントリップになる確率',
    }
  }

  private deconstructDeck(deck: Card[], { enchantressedT3, enchantressedT4 }: DeckOptions) {
    const i = deck.findIndex((card) => card === ACTION)
    if (i >= 0 && i < 5) {
      return enchantressedT3
        ? ([deck.slice(0, 6), deck.slice(6, 11), false, true] as const)
        : ([deck.slice(0, 5), deck.slice(5, 12), true, false] as const)
    } else if (i >= 5 && 5 < 10) {
      return enchantressedT4
        ? ([deck.slice(0, 5), deck.slice(5, 11), false, true] as const)
        : ([deck.slice(0, 5), deck.slice(5, 10), true, false] as const)
    } else {
      return [deck.slice(0, 5), deck.slice(5, 10), false, false] as const
    }
  }
}

class EnchantressOnlyMe extends Enchantress {
  title = () => '自分だけが銀貨・魔術師で4ターン目までに……'
  patternsOfDeck = () => [{ factor: 1, options: { enchantressedT3: false, enchantressedT4: false } }]
}

class EnchantressFirstPlayer extends Enchantress {
  title = () => '2人戦の先手番で自分も相手も銀貨・女魔術師の場合、4ターン目までに……'
  patternsOfDeck = () => [
    { factor: 7, options: { enchantressedT3: false, enchantressedT4: false } },
    { factor: 5, options: { enchantressedT3: false, enchantressedT4: true } },
  ]
}

class EnchantressSecondPlayer extends Enchantress {
  title = () => '2人戦の後手番で自分も相手も銀貨・女魔術師の場合、4ターン目までに……'
  patternsOfDeck = () => [
    { factor: 2, options: { enchantressedT3: false, enchantressedT4: false } },
    { factor: 5, options: { enchantressedT3: true, enchantressedT4: false } },
    { factor: 5, options: { enchantressedT3: false, enchantressedT4: true } },
  ]
}

run(new EnchantressOnlyMe(), new EnchantressFirstPlayer(), new EnchantressSecondPlayer())
