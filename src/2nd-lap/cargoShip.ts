import { run } from '@/runner'
import { ACTION, Card, Result, Tactic } from '@/tactic'
import { genDecksWithDouble, genDecksWithSilverAndAction, simpleDeckPattern, sumOfCoin } from '@/util'

type Topic = 'setAside5' | 'setAside6'

abstract class CargoShip implements Tactic<Card[], Topic> {
  readonly title = () => '屋敷場かつ銀貨・司教で4ターン目までに……'

  abstract genDecks(): Card[][]
  splitToHands(deck: Card[]) {
    return deck.slice(0, 5).sort()
  }
  patternsOfDeck = simpleDeckPattern

  simulate(hand: Card[]): Result<Topic> {
    const actionIncluded = hand.includes(ACTION)
    let coin = sumOfCoin(hand)
    if (actionIncluded) {
      coin += 2
    }

    return {
      setAside5: actionIncluded && coin >= 5,
      setAside6: actionIncluded && coin >= 6,
    }
  }

  topics(): { [t in Topic]: string } {
    return {
      setAside5: '5コスト以上のカードをプレイできる確率',
      setAside6: '6コスト以上のカードをプレイできる確率',
    }
  }
}

class CargoShipWithSilver extends CargoShip {
  title = () => '銀貨・貨物船で4ターン目までに……'
  genDecks = genDecksWithSilverAndAction
}

class DoubleCargoShip extends CargoShip {
  title = () => '貨物船・貨物船で4ターン目までに……'
  genDecks() {
    return genDecksWithDouble(ACTION)
  }
}

run(new CargoShipWithSilver(), new DoubleCargoShip())
