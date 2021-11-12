import { Tactic } from '@/tactic'

export class Runner {
  readonly log: (msg: string) => void

  constructor(log: (msg: string) => void) {
    this.log = log
  }

  run<Deck, Topic extends string, DeckOptions = Record<string, unknown>>(
    tactic: Tactic<Deck, Topic, DeckOptions>
  ): void {
    return
  }
}

export function run<Tactics extends Tactic<unknown, string, Record<string, unknown>>[]>(...tactics: Tactics): void {
  const runner = new Runner(console.log)
  for (let i = 0; i < tactics.length; i++) {
    runner.run(tactics[i])
    console.log('\n')
  }
  runner.run(tactics[tactics.length - 1])
}
