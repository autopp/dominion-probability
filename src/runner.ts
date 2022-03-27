import { Result, Tactic } from '@/tactic'
import { printf } from 'fast-printf'

export class Runner {
  readonly log: (msg: string) => void

  constructor(log: (msg: string) => void) {
    this.log = log
  }

  run<Deck, Topic extends string, DeckOptions = Record<string, unknown>>(
    tactic: Tactic<Deck, Topic, DeckOptions>
  ): void {
    const allPatterns = this.simulateAll(tactic)
    const all = allPatterns.reduce((sum, { factor }) => sum + factor, 0)
    this.log(`#### ${tactic.title()}`)
    this.log('')
    Object.entries<string>(tactic.topics()).forEach(([t, text]) => {
      const topic = t as Topic
      const count = allPatterns.reduce((sum, { result, factor }) => (result[topic] ? factor + sum : sum), 0)
      this.log(`- ${text}: ${printf('%.2f', (count / all) * 100)}%`)
    })
  }

  private simulateAll<Deck, Topic extends string, DeckOptions = Record<string, unknown>>(
    tactic: Tactic<Deck, Topic, DeckOptions>
  ): { result: Result<Topic>; factor: number }[] {
    const decks = this.aggregateDecks(tactic.genDecks().map((deck) => tactic.splitToHands(deck)))
    const patterns = tactic.patternsOfDeck()

    return decks.flatMap(({ deck, count }) =>
      patterns.map(({ factor, options }) => ({
        result: tactic.simulate(deck, options),
        factor: factor * count,
      }))
    )
  }

  private aggregateDecks<Deck>(decks: Deck[]): { deck: Deck; count: number }[] {
    const stats: Record<string, { deck: Deck; count: number }> = {}

    decks.forEach((deck) => {
      const key = JSON.stringify(deck)
      const entry = stats[key]
      if (entry === undefined) {
        stats[key] = { deck, count: 1 }
      } else {
        entry.count++
      }
    })

    return Object.values(stats)
  }
}

export function run<Tactics extends Tactic<unknown, string, Record<string, unknown>>[]>(...tactics: Tactics): void {
  const runner = new Runner(console.log)
  tactics.forEach((tactic, i) => {
    runner.run(tactic)
    if (i != tactics.length - 1) {
      console.log('\n')
    }
  })
}
