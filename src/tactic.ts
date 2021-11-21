export type Card = string

export const COPPER: Card = 'copper'
export const SILVER: Card = 'silver'
export const GOLD: Card = 'gold'
export const ESTATE: Card = 'estate'
export const ACTION: Card = 'action'

export type Result<Topic extends string> = { [k in Topic]: boolean }

export interface Tactic<Deck, Topic extends string, DeckOptions = Record<string, unknown>> {
  title(): string
  genDecks(): Card[][]
  splitToHands(deck: Card[]): Deck
  patternsOfDeck(): { factor: number; options: DeckOptions }[]
  simulate(deck: Deck, options: DeckOptions): Result<Topic>
  topics(): { [k in Topic]: string }
}
