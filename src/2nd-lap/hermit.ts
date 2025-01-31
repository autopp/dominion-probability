import { run } from '@/runner'
import { ACTION, Card, ESTATE, Result, Tactic } from '@/tactic'
import {
  AtLeastOnce,
  genDecksWithDouble,
  genDecksWithSilverAndAction,
  resultOfAtLeastOnces,
  simpleDeckPattern,
  splitByNoDraw,
  sumOfCoin,
  topicForAtLeastOnce5,
} from '@/util'
import { count } from 'arubyray'

type UsingHermits = `usingHermit${1 | 2}`
type TrashingEstates = `trashingEstates${1 | 2}`

type Topic = AtLeastOnce<5> | UsingHermits | TrashingEstates

abstract class Hermit implements Tactic<[Card[], Card[]], Topic> {
  abstract title(): string

  abstract genDecks(): string[][]

  readonly splitToHands = splitByNoDraw
  readonly patternsOfDeck = simpleDeckPattern

  simulate(deck: [Card[], Card[]]): Result<Topic> {
    const t3 = this.simulateTurn(deck[0], false)
    const t4 = this.simulateTurn(deck[1], true)
    const usingHermits = count([t3, t4], ({ usingHermit }) => usingHermit)
    const trashingEstates = count([t3, t4], ({ trashingEstate }) => trashingEstate)

    return {
      ...resultOfAtLeastOnces(t3, t4, 5),
      usingHermit1: usingHermits === 1,
      usingHermit2: usingHermits === 2,
      trashingEstates1: trashingEstates === 1,
      trashingEstates2: trashingEstates === 2,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      ...topicForAtLeastOnce5(false),
      usingHermit1: '隠遁者を1回使える確率',
      usingHermit2: '隠遁者を2回使える確率',
      trashingEstates1: '屋敷を1枚廃棄できる確率',
      trashingEstates2: '屋敷を2枚廃棄できる確率',
    }
  }

  private simulateTurn(hand: Card[], ensureEstate: boolean) {
    const coin = sumOfCoin(hand)
    const usingHermit = hand.includes(ACTION)
    return { coin, usingHermit, trashingEstate: usingHermit && (ensureEstate || hand.includes(ESTATE)) }
  }
}

class DoubleHermit extends Hermit {
  readonly title = () => '隠遁者・隠遁者で4ターン目までに……'

  genDecks() {
    return genDecksWithDouble(ACTION)
  }
}

class HermitWithSilver extends Hermit {
  readonly title = () => '隠遁者・銀貨で4ターン目までに……'

  genDecks = genDecksWithSilverAndAction
}

run(new DoubleHermit(), new HermitWithSilver())
