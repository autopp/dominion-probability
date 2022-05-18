import { run } from '@/runner'
import { ACTION, Card, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWith,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  splitByNoDraw,
  splitInto,
  sumOfCoin,
  topicForAtLeastOnces,
  topicForBoth5,
} from '@/util'

type Topic = AtLeastOnce<5 | 6 | 7> | Both<5>

abstract class Blockade implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string
  abstract genDecks(): Card[][]
  abstract splitToHands(deck: Card[]): [Card[], Card[]]

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const [hand3, hand4] = deck
    const t3 = this.simulateTurn(hand3, false)
    const t4 = this.simulateTurn(hand4, t3.reserving)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7),
      ...resultOfBoth5(t3, t4),
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnces(5, 6, 7),
      ...topicForBoth5(),
    }
  }

  private simulateTurn(hand: Card[], duration: boolean) {
    let coin = sumOfCoin(hand)
    if (duration) {
      coin += this.coinOfGained()
    }

    return { coin, reserving: hand.includes(ACTION) }
  }

  abstract coinOfGained(): number
}

class BlockadeWithSilverGainingSilver extends Blockade {
  readonly title = () => '銀貨・Blockade で銀貨を獲得する場合、4ターン目までに……'
  genDecks = genDecksWithSilverAndAction

  splitToHands = splitByNoDraw

  coinOfGained = () => 2
}

class BlockadeWithSilverGainingCantrip extends Blockade {
  readonly title = () => '銀貨・Blockade でキャントリップ0金を獲得する場合、4ターン目までに……'
  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]) {
    const i = deck.findIndex((c) => c === ACTION)

    if (i >= 0 && i < 5) {
      return splitInto(deck, 5, 6)
    } else {
      return splitByNoDraw(deck)
    }
  }

  coinOfGained = () => 0
}

class BlockadeWithSilverGainingCantripCoin extends Blockade {
  readonly title = () => '銀貨・Blockade でキャントリップ1金を獲得する場合、4ターン目までに……'
  genDecks = genDecksWithSilverAndAction

  splitToHands(deck: Card[]) {
    const i = deck.findIndex((c) => c === ACTION)

    if (i >= 0 && i < 5) {
      return splitInto(deck, 5, 6)
    } else {
      return splitByNoDraw(deck)
    }
  }

  coinOfGained = () => 1
}

class BlockadeOnlyGainingSilver extends Blockade {
  readonly title = () => 'Blockade・パス（あるいは騎士見習いなど）で銀貨を獲得する場合、4ターン目までに……'
  genDecks() {
    return genDecksWith(ACTION)
  }

  splitToHands = splitByNoDraw

  coinOfGained = () => 2
}

class BlockadeOnlyGainingCantrip extends Blockade {
  readonly title = () => 'Blockade・パス（あるいは騎士見習いなど）でキャントリップ0金を獲得する場合、4ターン目までに……'
  genDecks() {
    return genDecksWith(ACTION)
  }

  splitToHands(deck: Card[]) {
    const i = deck.findIndex((c) => c === ACTION)

    if (i >= 0 && i < 5) {
      return splitInto(deck, 5, 6)
    } else {
      return splitByNoDraw(deck)
    }
  }

  coinOfGained = () => 0
}

class BlockadeOnlyGainingCantripCoin extends Blockade {
  readonly title = () => 'Blockade・パス（あるいは騎士見習いなど）でキャントリップ1金を獲得する場合、4ターン目までに……'
  genDecks() {
    return genDecksWith(ACTION)
  }

  splitToHands(deck: Card[]) {
    const i = deck.findIndex((c) => c === ACTION)

    if (i >= 0 && i < 5) {
      return splitInto(deck, 5, 6)
    } else {
      return splitByNoDraw(deck)
    }
  }

  coinOfGained = () => 1
}

run(
  new BlockadeWithSilverGainingSilver(),
  new BlockadeWithSilverGainingCantrip(),
  new BlockadeWithSilverGainingCantripCoin(),
  new BlockadeOnlyGainingSilver(),
  new BlockadeOnlyGainingCantrip(),
  new BlockadeOnlyGainingCantripCoin()
)
