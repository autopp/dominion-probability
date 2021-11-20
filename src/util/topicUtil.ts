export function topicForAtLeastOnce<Coin extends number>(
  coin: Coin,
  geq = true
): { [t in `atLeastOnce${Coin}`]: string } {
  return {
    [`atLeastOnce${coin}`]: `一度でも${coin}金${geq ? '以上' : ''}が出る確率`,
  } as { [t in `atLeastOnce${Coin}`]: string }
}

export function topicForAtLeastOnce5(geq = true): { atLeastOnce5: string } {
  return topicForAtLeastOnce(5, geq)
}

export function topicForAtLeastOnce6(geq = true): { atLeastOnce6: string } {
  return topicForAtLeastOnce(6, geq)
}

export function topicForAtLeastOnce7(geq = true): { atLeastOnce7: string } {
  return topicForAtLeastOnce(7, geq)
}

export function topicForAtLeastOnce8(geq = true): { atLeastOnce8: string } {
  return topicForAtLeastOnce(8, geq)
}

export function topicForBoth<Coin extends number>(coin: Coin, geq = true): { [t in `both${Coin}`]: string } {
  return { [`both${coin}`]: `両ターン共に${coin}金${geq ? '以上' : ''}が出る確率` } as { [t in `both${Coin}`]: string }
}

export function topicForBoth5(geq = true): { both5: string } {
  return topicForBoth(5, geq)
}

export function topicForBothAndAtLeastOnce<B extends number, L extends number>(
  bothCoin: B,
  atLeastOnceCoin: L,
  geq = true
): { [t in `both${B}AndAtLeastOnce${L}`]: string } {
  const key = `both${bothCoin}AndAtLeastOnce${atLeastOnceCoin}`
  return {
    [key]: `両ターン共に${bothCoin}金が出て、かつ一度でも${atLeastOnceCoin}金${geq ? '以上' : ''}が出る確率`,
  } as { [t in `both${B}AndAtLeastOnce${L}`]: string }
}

export function topicForTrashingEstate(): { trashingEstate: string } {
  return { trashingEstate: '屋敷を廃棄できる確率' }
}

export function topicForTrashingEstateAndAtLeastOnce<Coin extends number>(
  coin: Coin,
  geq = true
): { [t in `trashingEstateAndAtLeastOnce${Coin}`]: string } {
  return {
    [`trashingEstateAndAtLeastOnce${coin}`]: `屋敷を廃棄しつつ一度でも${coin}金${geq ? '以上' : ''}が出る確率`,
  } as { [t in `trashingEstateAndAtLeastOnce${Coin}`]: string }
}

export function topicForTrashingEstateAndAtLeastOnce5(geq = true): { trashingEstateAndAtLeastOnce5: string } {
  return topicForTrashingEstateAndAtLeastOnce(5, geq)
}
