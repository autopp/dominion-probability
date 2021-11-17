import { Card, COPPER, ESTATE } from '@/tactic'
import { combination } from 'arubyray'

class DeckFactory {
  private readonly size: number
  private readonly estates: number[]

  constructor(size: number, estates: number[]) {
    this.size = size
    this.estates = estates
  }

  create(callbackfn: (deck: Card[]) => void): Card[] {
    const deck = new Array(this.size).fill(COPPER)
    this.estates.forEach((i) => {
      deck[i] = ESTATE
    })

    callbackfn(deck)

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

export function genDecksWithDouble(card: Card): Card[][] {
  return withCombinationOfEstates(12, (factory, otherIndices) =>
    combination(otherIndices, 2).map((gained) =>
      factory.create((deck) => {
        deck[gained[0] as number] = card
        deck[gained[1] as number] = card
      })
    )
  )
}
