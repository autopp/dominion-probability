import { run } from '@/runner'
import { Card, COPPER, ESTATE, Result, SILVER, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  Both,
  genDecksWithDoubleSilver,
  resultOfAtLeastOnces,
  resultOfBoth5,
  simpleDeckPattern,
  simulateTurnWithBaseCoinOnly,
  splitInto,
  topicForAtLeastOnces,
  topicForBoth5,
  withCombinationOfEstates,
} from '@/util'

type TopicForFirstTurn = AtLeastOnce<5 | 6> | 'coin5AtTurn2'

class FlagBearerAtFirstTurn implements Tactic<[Card[], Card[]], TopicForFirstTurn> {
  readonly title = () => '旗手を1ターン目に購入し、自分の2ターン目までに旗を奪われた場合、3ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(6, 1, (factory, otherIndices) =>
      otherIndices.map((flag) => [
        COPPER,
        COPPER,
        COPPER,
        ESTATE,
        ESTATE,
        ...factory.create((deck) => {
          deck[flag] = SILVER
        }),
      ])
    )
  }

  splitToHands = (deck: Card[]) => splitInto(deck, 6, 5)

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<TopicForFirstTurn> {
    const [t2, t3] = deck.map(simulateTurnWithBaseCoinOnly)

    return {
      ...resultOfAtLeastOnces(t2, t3, 5, 6),
      coin5AtTurn2: t2.coin >= 5,
    }
  }

  topics(): { [t in TopicForFirstTurn]: string } {
    return {
      ...topicForAtLeastOnces(5, 6),
      coin5AtTurn2: '2ターン目に5金以上が出る確率',
    }
  }
}

type TopicForSecondTurn = AtLeastOnce<5 | 6 | 7 | 8> | Both<5>

abstract class FlagBearerAtSecondTurn implements Tactic<[Card[], Card[]], TopicForSecondTurn> {
  abstract title(): string

  genDecks = genDecksWithDoubleSilver

  abstract splitToHands(deck: Card[]): [Card[], Card[]]

  patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<TopicForSecondTurn> {
    const [t3, t4] = deck.map(simulateTurnWithBaseCoinOnly)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5, 6, 7, 8),
      ...resultOfBoth5(t3, t4),
    }
  }

  topics(): { [t in TopicForSecondTurn]: string } {
    return {
      ...topicForAtLeastOnces(5, 6, 7, 8),
      ...topicForBoth5(),
    }
  }
}

class FlagBearerAtSecondTurnWithoutFlag extends FlagBearerAtSecondTurn {
  title = () => '銀貨・旗手で自分の3ターン目までに旗を奪われた場合、4ターン目までに'

  splitToHands = (deck: Card[]) => splitInto(deck, 6, 5)
}

class FlagBearerAtSecondTurnWithFlag extends FlagBearerAtSecondTurn {
  title = () => '銀貨・旗手で自分の3ターン目までに旗を奪われなかった場合、4ターン目までに……'

  splitToHands = (deck: Card[]) => splitInto(deck, 6, 6)
}

run(new FlagBearerAtFirstTurn(), new FlagBearerAtSecondTurnWithoutFlag(), new FlagBearerAtSecondTurnWithFlag())
