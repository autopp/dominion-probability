import { Result } from '@/tactic'
import { AtLeastOnce } from './topicUtil'

function assertContainsKey(t3: Record<string, unknown>, t4: Record<string, unknown>, k: string): void {
  if (t3[k] === undefined) {
    throw new Error(`turn3 dose not contain ${k}`)
  }

  if (t4[k] === undefined) {
    throw new Error(`turn4 dose not contain ${k}`)
  }
}

export function any<Topic extends string>(t3: Result<Topic>, t4: Result<Topic>, k: Topic): boolean {
  assertContainsKey(t3, t4, k)

  return t3[k] || t4[k]
}

export function all<Topic extends string>(t3: Result<Topic>, t4: Result<Topic>, k: Topic): boolean {
  assertContainsKey(t3, t4, k)

  return t3[k] && t4[k]
}

export function atLeastOnce(t3: { coin: number }, t4: { coin: number }, coin: number): boolean {
  assertContainsKey(t3, t4, 'coin')

  return t3.coin >= coin || t4.coin >= coin
}

export function atLeastOnce5(t3: { coin: number }, t4: { coin: number }): boolean {
  return atLeastOnce(t3, t4, 5)
}

export function atLeastOnce6(t3: { coin: number }, t4: { coin: number }): boolean {
  return atLeastOnce(t3, t4, 6)
}

export function atLeastOnce7(t3: { coin: number }, t4: { coin: number }): boolean {
  return atLeastOnce(t3, t4, 7)
}

export function both(t3: { coin: number }, t4: { coin: number }, coin: number): boolean {
  assertContainsKey(t3, t4, 'coin')

  return t3.coin >= coin && t4.coin >= coin
}

export function both5(t3: { coin: number }, t4: { coin: number }): boolean {
  return both(t3, t4, 5)
}

export function trashingEstate(t3: { trashingEstate: boolean }, t4: { trashingEstate: boolean }): boolean {
  return any(t3, t4, 'trashingEstate')
}

export function resultOfAny<Topic extends string>(
  t3: Result<Topic>,
  t4: Result<Topic>,
  k: Topic
): { [t in Topic]: boolean } {
  return { [k]: any(t3, t4, k) } as { [t in Topic]: boolean }
}

export function resultOfAll<Topic extends string>(
  t3: Result<Topic>,
  t4: Result<Topic>,
  k: Topic
): { [t in Topic]: boolean } {
  return { [k]: all(t3, t4, k) } as { [t in Topic]: boolean }
}

export function resultOfAtLeastOnce<Coin extends number>(
  t3: { coin: number },
  t4: { coin: number },
  coin: Coin
): { [t in `atLeastOnce${Coin}`]: boolean } {
  return { [`atLeastOnce${coin}`]: atLeastOnce(t3, t4, coin) } as { [t in `atLeastOnce${Coin}`]: boolean }
}

export function resultOfAtLeastOnce5(t3: { coin: number }, t4: { coin: number }): { atLeastOnce5: boolean } {
  return resultOfAtLeastOnce(t3, t4, 5)
}

export function resultOfAtLeastOnce6(t3: { coin: number }, t4: { coin: number }): { atLeastOnce6: boolean } {
  return resultOfAtLeastOnce(t3, t4, 6)
}

export function resultOfAtLeastOnce7(t3: { coin: number }, t4: { coin: number }): { atLeastOnce7: boolean } {
  return resultOfAtLeastOnce(t3, t4, 7)
}

export function resultOfAtLeastOnces<Coin extends number>(
  t3: { coin: number },
  t4: { coin: number },
  ...coins: Coin[]
): { [t in AtLeastOnce<Coin>]: boolean } {
  return Object.assign({}, ...coins.map((coin) => resultOfAtLeastOnce(t3, t4, coin)))
}

export function resultOfBoth<Coin extends number>(
  t3: { coin: number },
  t4: { coin: number },
  coin: Coin
): { [t in `both${Coin}`]: boolean } {
  return { [`both${coin}`]: both(t3, t4, coin) } as { [t in `both${Coin}`]: boolean }
}

export function resultOfBoth5(t3: { coin: number }, t4: { coin: number }): { both5: boolean } {
  return resultOfBoth(t3, t4, 5)
}

export function resultOfBothAndAtLeastOnce<B extends number, L extends number>(
  t3: { coin: number },
  t4: { coin: number },
  bothCoin: B,
  atLeastOnceCoin: L
): { [t in `both${B}AndAtLeastOnce${L}`]: boolean } {
  const key = `both${bothCoin}AndAtLeastOnce${atLeastOnceCoin}`
  return {
    [key]: both(t3, t4, bothCoin) && atLeastOnce(t3, t4, atLeastOnceCoin),
  } as { [t in `both${B}AndAtLeastOnce${L}`]: boolean }
}

export function resultOfTrashingEstate(
  t3: { trashingEstate: boolean },
  t4: { trashingEstate: boolean }
): { trashingEstate: boolean } {
  return resultOfAny(t3, t4, 'trashingEstate')
}

export function resultOfTrashingEstateAndAtLeastOnce<Coin extends number>(
  t3: { trashingEstate: boolean; coin: number },
  t4: { trashingEstate: boolean; coin: number },
  coin: Coin
): { [t in `trashingEstateAndAtLeastOnce${Coin}`]: boolean } {
  const key = `trashingEstateAndAtLeastOnce${coin}`
  return { [key]: trashingEstate(t3, t4) && atLeastOnce(t3, t4, coin) } as {
    [t in `trashingEstateAndAtLeastOnce${Coin}`]: boolean
  }
}

export function resultOfTrashingEstateAndAtLeastOnce5(
  t3: { trashingEstate: boolean; coin: number },
  t4: { trashingEstate: boolean; coin: number }
): { trashingEstateAndAtLeastOnce5: boolean } {
  return resultOfTrashingEstateAndAtLeastOnce(t3, t4, 5)
}
