export type AtLeastOnce<N extends number> = `atLeastOnce${N}`
export type Both<N extends number> = `both${N}`
export type BothAndAtLeastOnce<B extends number, L extends number> = `both${B}AndAtLeastOnce${L}`
export type TrashingEstate = 'trashingEstate'
export type TrashingEstateAndAtLeastOnce<N extends number> = `trashingEstateAndAtLeastOnce${N}`

export function topicForAtLeastOnce<Coin extends number>(coin: Coin, geq = true): { [t in AtLeastOnce<Coin>]: string } {
  return {
    [`atLeastOnce${coin}`]: `一度でも${coin}金${geq ? '以上' : ''}が出る確率`,
  } as { [t in AtLeastOnce<Coin>]: string }
}

export function topicForAtLeastOnce5(geq = true): { [t in AtLeastOnce<5>]: string } {
  return topicForAtLeastOnce(5, geq)
}

export function topicForAtLeastOnce6(geq = true): { [t in AtLeastOnce<6>]: string } {
  return topicForAtLeastOnce(6, geq)
}

export function topicForAtLeastOnce7(geq = true): { [t in AtLeastOnce<7>]: string } {
  return topicForAtLeastOnce(7, geq)
}

export function topicForAtLeastOnce8(geq = true): { [t in AtLeastOnce<8>]: string } {
  return topicForAtLeastOnce(8, geq)
}

export function topicForAtLeastOnces<Coin extends number>(...coins: Coin[]): { [t in AtLeastOnce<Coin>]: string } {
  return Object.assign({}, ...coins.map((coin) => topicForAtLeastOnce(coin)))
}

export function topicForBoth<Coin extends number>(coin: Coin, geq = true): { [t in Both<Coin>]: string } {
  return { [`both${coin}`]: `両ターン共に${coin}金${geq ? '以上' : ''}が出る確率` } as { [t in Both<Coin>]: string }
}

export function topicForBoth5(geq = true): { [t in Both<5>]: string } {
  return topicForBoth(5, geq)
}

export function topicForBothAndAtLeastOnce<B extends number, L extends number>(
  bothCoin: B,
  atLeastOnceCoin: L,
  geq = true
): { [t in BothAndAtLeastOnce<B, L>]: string } {
  const key = `both${bothCoin}AndAtLeastOnce${atLeastOnceCoin}`
  return {
    [key]: `両ターン共に${bothCoin}金が出て、かつ一度でも${atLeastOnceCoin}金${geq ? '以上' : ''}が出る確率`,
  } as { [t in BothAndAtLeastOnce<B, L>]: string }
}

export function topicForTrashingEstate(): { [t in TrashingEstate]: string } {
  return { trashingEstate: '屋敷を廃棄できる確率' }
}

export function topicForTrashingEstateAndAtLeastOnce<Coin extends number>(
  coin: Coin,
  geq = true
): { [t in TrashingEstateAndAtLeastOnce<Coin>]: string } {
  return {
    [`trashingEstateAndAtLeastOnce${coin}`]: `屋敷を廃棄しつつ一度でも${coin}金${geq ? '以上' : ''}が出る確率`,
  } as { [t in TrashingEstateAndAtLeastOnce<Coin>]: string }
}

export function topicForTrashingEstateAndAtLeastOnce5(geq = true): { [t in TrashingEstateAndAtLeastOnce<5>]: string } {
  return topicForTrashingEstateAndAtLeastOnce(5, geq)
}
