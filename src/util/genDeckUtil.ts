import { ACTION, Card, COPPER, ESTATE, SILVER } from '@/tactic'
import { combination, permutation } from 'arubyray'

class DeckFactory {
  private readonly size: number
  private readonly estates: number[]

  constructor(size: number, estates: number[]) {
    this.size = size
    this.estates = estates
  }

  create(callbackfn?: ((deck: Card[]) => void) | undefined): Card[] {
    const deck = new Array(this.size).fill(COPPER)
    this.estates.forEach((i) => {
      deck[i] = ESTATE
    })

    if (callbackfn !== undefined) {
      callbackfn(deck)
    }

    return deck
  }
}

export function withCombinationOfEstates(
  size: number,
  callbackfn: (factory: DeckFactory, otherIndices: number[]) => Card[][]
): Card[][]

export function withCombinationOfEstates(
  size: number,
  numOfEstate: number,
  callbackfn: (factory: DeckFactory, otherIndices: number[]) => Card[][]
): Card[][]

export function withCombinationOfEstates(
  ...args:
    | [number, (factory: DeckFactory, otherIndices: number[]) => Card[][]]
    | [number, number, (factory: DeckFactory, otherIndices: number[]) => Card[][]]
): Card[][] {
  const size = args[0]
  const [numOfEstate, callbackfn] = args.length == 2 ? [3, args[1]] : [args[1], args[2]]

  const indices: number[] = []
  for (let i = 0; i < size; i++) {
    indices.push(i)
  }

  return combination(indices, numOfEstate).flatMap((estates) => {
    const factory = new DeckFactory(size, estates)

    return callbackfn(
      factory,
      indices.filter((i) => !estates.includes(i))
    )
  })
}

export function genDecksWith(...cards: Card[]): Card[][] {
  const n = cards.length
  return withCombinationOfEstates(10 + n, (factory, otherIndices) =>
    combination(otherIndices, n).map((indices) =>
      factory.create((deck) => {
        indices.forEach((i, j) => {
          deck[i] = cards[j]
        })
      })
    )
  )
}

export function genDecksWithDouble(card: Card): Card[][] {
  return withCombinationOfEstates(12, (factory, otherIndices) =>
    combination(otherIndices, 2).map(([first, second]) =>
      factory.create((deck) => {
        deck[first] = card
        deck[second] = card
      })
    )
  )
}

export function genDecksWithDoubleSilver(): Card[][] {
  return genDecksWithDouble(SILVER)
}

export function genDecksWithSilverAndAction(): Card[][] {
  return withCombinationOfEstates(12, (factory, otherIndices) =>
    permutation(otherIndices, 2).map(([silver, action]) =>
      factory.create((deck) => {
        deck[silver] = SILVER
        deck[action] = ACTION
      })
    )
  )
}

export function simpleDeckPattern(): { factor: number; options: Record<string, unknown> }[] {
  return [{ factor: 1, options: {} }]
}
