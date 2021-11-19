import { ACTION, Card } from '@/tactic'

export function splitByNoDraw(deck: readonly Card[]): [Card[], Card[]] {
  return [deck.slice(0, 5).sort(), deck.slice(5, 10).sort()]
}

export function splitByDraw(deck: readonly Card[], draw: number): [Card[], Card[]] {
  const i = deck.indexOf(ACTION)
  if (i >= 0 && i < 5) {
    return [deck.slice(0, 5 + draw).sort(), deck.slice(5 + draw, 10 + draw).sort()]
  }

  if (i >= 5 && i < 10) {
    return [deck.slice(0, 5).sort(), deck.slice(5, 10 + draw).sort()]
  }

  return splitByNoDraw(deck)
}
