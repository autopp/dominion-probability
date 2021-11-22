import { ACTION, Card } from '@/tactic'

export function splitInto(deck: readonly Card[], turn3: number, turn4: number): [Card[], Card[]] {
  return [deck.slice(0, turn3).sort(), deck.slice(turn3, turn3 + turn4).sort()]
}

export function splitByNoDraw(deck: readonly Card[]): [Card[], Card[]] {
  return splitInto(deck, 5, 5)
}

export function splitByDraw(deck: readonly Card[], draw: number): [Card[], Card[]] {
  const i = deck.indexOf(ACTION)
  if (i >= 0 && i < 5) {
    return splitInto(deck, 5 + draw, 5)
  }

  if (i >= 5 && i < 10) {
    return splitInto(deck, 5, 5 + draw)
  }

  return splitByNoDraw(deck)
}
