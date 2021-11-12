export type Card = string

export interface Tactic<Deck, Topic extends string, DeckOptions = Record<string, unknown>> {
  title(): string
  genDecks(): Card[][]
  splitToHands(): Deck
  patternOfDeck(): { factor: number; options: DeckOptions }[]
  simulate(hand: Card[], options: DeckOptions): { [k in Topic]: boolean }
  topics(): { [k in Topic]: string }
}
