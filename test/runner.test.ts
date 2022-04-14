import { Runner } from '@/runner'
import { Card, COPPER, ESTATE, Result, Tactic } from '@/tactic'

type TestTopic = 'includeEstate' | 'includeCopper'

class TestTactic implements Tactic<[Card[], Card[]], TestTopic> {
  title(): string {
    return 'test'
  }

  genDecks(): Card[][] {
    return [
      [COPPER, COPPER],
      [COPPER, COPPER],
      [COPPER, ESTATE],
    ]
  }

  splitToHands(deck: Card[]): [Card[], Card[]] {
    return [[deck[0]], [deck[1]]]
  }

  patternsOfDeck(): { factor: number; options: Record<string, never> }[] {
    return [{ factor: 1, options: {} }]
  }

  simulate(deck: [Card[], Card[]]): Result<TestTopic> {
    return {
      includeCopper: deck.some((hand) => hand.includes(COPPER)),
      includeEstate: deck.some((hand) => hand.includes(ESTATE)),
    }
  }

  topics(): { [k in TestTopic]: string } {
    return {
      includeCopper: 'copper included',
      includeEstate: 'estate included',
    }
  }
}

describe('Runner', () => {
  describe('run()', () => {
    it('simulates all deck patterns and reports results', () => {
      let allMsg = ''
      const log = (msg: string) => {
        allMsg += msg + '\n'
      }
      const runner = new Runner(log)

      runner.run(new TestTactic())
      const expected = `#### test

- copper included: 100.00%
- estate included: 33.33%
`
      expect(allMsg).toEqual(expected)
    })
  })
})
