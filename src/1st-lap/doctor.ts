import { run } from '@/runner'
import { Card, ESTATE, Result, Tactic } from '@/tactic'
import { simpleDeckPattern, withCombinationOfEstates } from '@/util'
import { count, take } from 'arubyray'

type Topic = 'trashingOneEstate' | 'trashingTwoEstates'

class Doctor implements Tactic<Card[], Topic> {
  readonly title = () => '銅貨7枚・屋敷3枚で2ターン目までに……'

  genDecks() {
    return withCombinationOfEstates(5, (factory) => {
      return [factory.create()]
    })
  }
  splitToHands = (deck: Card[]) => deck
  patternsOfDeck = simpleDeckPattern

  simulate(deck: Card[]): Result<Topic> {
    const trashingEstate = count(take(deck, 2), (c) => c === ESTATE)

    return {
      trashingOneEstate: trashingEstate === 1,
      trashingTwoEstates: trashingEstate === 2,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      trashingOneEstate: '屋敷を1枚廃棄できる確率',
      trashingTwoEstates: '屋敷を2枚廃棄できる確率',
    }
  }
}

run(new Doctor())
