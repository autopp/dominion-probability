import {
  topicForAtLeastOnce,
  topicForAtLeastOnce5,
  topicForAtLeastOnce6,
  topicForAtLeastOnce7,
  topicForAtLeastOnce8,
  topicForAtLeastOnces,
  topicForBoth,
  topicForBoth5,
  topicForBothAndAtLeastOnce,
  topicForTrashingEstate,
  topicForTrashingEstateAndAtLeastOnce,
  topicForTrashingEstateAndAtLeastOnce5,
} from '@/util/topicUtil'

describe('topicForAtLeastOnce', () => {
  it.each([
    { coin: 5, geq: true, expected: { atLeastOnce5: '一度でも5金以上が出る確率' } },
    { coin: 6, geq: false, expected: { atLeastOnce6: '一度でも6金が出る確率' } },
  ])('when coin = $coin and geq = $geq, returns $expected', ({ coin, geq, expected }) => {
    expect(topicForAtLeastOnce(coin, geq)).toEqual(expected)
  })
})

describe('topicForAtLeastOnce5', () => {
  it.each([
    { geq: true, expected: { atLeastOnce5: '一度でも5金以上が出る確率' } },
    { geq: false, expected: { atLeastOnce5: '一度でも5金が出る確率' } },
  ])('when geq = $geq, returns $expected', ({ geq, expected }) => {
    expect(topicForAtLeastOnce5(geq)).toEqual(expected)
  })
})

describe('topicForAtLeastOnce6', () => {
  it.each([
    { geq: true, expected: { atLeastOnce6: '一度でも6金以上が出る確率' } },
    { geq: false, expected: { atLeastOnce6: '一度でも6金が出る確率' } },
  ])('when geq = $geq, returns $expected', ({ geq, expected }) => {
    expect(topicForAtLeastOnce6(geq)).toEqual(expected)
  })
})

describe('topicForAtLeastOnce7', () => {
  it.each([
    { geq: true, expected: { atLeastOnce7: '一度でも7金以上が出る確率' } },
    { geq: false, expected: { atLeastOnce7: '一度でも7金が出る確率' } },
  ])('when geq = $geq, returns $expected', ({ geq, expected }) => {
    expect(topicForAtLeastOnce7(geq)).toEqual(expected)
  })
})

describe('topicForAtLeastOnce8', () => {
  it.each([
    { geq: true, expected: { atLeastOnce8: '一度でも8金以上が出る確率' } },
    { geq: false, expected: { atLeastOnce8: '一度でも8金が出る確率' } },
  ])('when geq = $geq, returns $expected', ({ geq, expected }) => {
    expect(topicForAtLeastOnce8(geq)).toEqual(expected)
  })
})

describe('topicForAtLeastOnces', () => {
  it.each([
    {
      coins: [5, 6, 7],
      expected: {
        atLeastOnce5: '一度でも5金以上が出る確率',
        atLeastOnce6: '一度でも6金以上が出る確率',
        atLeastOnce7: '一度でも7金以上が出る確率',
      },
    },
  ])('when coins = $coins, returns $expected', ({ coins, expected }) => {
    expect(topicForAtLeastOnces(...coins)).toEqual(expected)
  })
})

describe('topicForBoth', () => {
  it.each([
    { coin: 5, geq: true, expected: { both5: '両ターン共に5金以上が出る確率' } },
    { coin: 6, geq: false, expected: { both6: '両ターン共に6金が出る確率' } },
  ])('when coin = $coin and geq = $geq, returns $expected', ({ coin, geq, expected }) => {
    expect(topicForBoth(coin, geq)).toEqual(expected)
  })
})

describe('topicForBoth5', () => {
  it.each([
    { geq: true, expected: { both5: '両ターン共に5金以上が出る確率' } },
    { geq: false, expected: { both5: '両ターン共に5金が出る確率' } },
  ])('when geq = $geq, returns $expected', ({ geq, expected }) => {
    expect(topicForBoth5(geq)).toEqual(expected)
  })
})

describe('topicForBothAndAtLeastOnce', () => {
  it.each([
    {
      bothCoin: 5,
      atLeastOnceCoin: 6,
      geq: true,
      expected: { both5AndAtLeastOnce6: '両ターン共に5金が出て、かつ一度でも6金以上が出る確率' },
    },
    {
      bothCoin: 5,
      atLeastOnceCoin: 6,
      geq: false,
      expected: { both5AndAtLeastOnce6: '両ターン共に5金が出て、かつ一度でも6金が出る確率' },
    },
  ])(
    'when bothCoin = $bothCoin, atLeastOnceCoin = $atLeastOnceCoin and geq = $geq, returns $expected',
    ({ bothCoin, atLeastOnceCoin, geq, expected }) => {
      expect(topicForBothAndAtLeastOnce(bothCoin, atLeastOnceCoin, geq)).toEqual(expected)
    }
  )
})

describe('topicForTrashingEstate', () => {
  it('returns { trashingEstate: "屋敷を廃棄できる確率" }', () => {
    expect(topicForTrashingEstate()).toEqual({ trashingEstate: '屋敷を廃棄できる確率' })
  })
})

describe('topicForTrashingEstateAndAtLeastOnce', () => {
  it.each([
    {
      coin: 5,
      geq: true,
      expected: { trashingEstateAndAtLeastOnce5: '屋敷を廃棄しつつ一度でも5金以上が出る確率' },
    },
    {
      coin: 6,
      geq: false,
      expected: { trashingEstateAndAtLeastOnce6: '屋敷を廃棄しつつ一度でも6金が出る確率' },
    },
  ])('when coin = $coin and geq = $geq, returns $expected', ({ coin, geq, expected }) => {
    expect(topicForTrashingEstateAndAtLeastOnce(coin, geq)).toEqual(expected)
  })
})

describe('topicForTrashingEstateAndAtLeastOnce5', () => {
  it.each([
    {
      geq: true,
      expected: { trashingEstateAndAtLeastOnce5: '屋敷を廃棄しつつ一度でも5金以上が出る確率' },
    },
    {
      geq: false,
      expected: { trashingEstateAndAtLeastOnce5: '屋敷を廃棄しつつ一度でも5金が出る確率' },
    },
  ])('when coin = $coin and geq = $geq, returns $expected', ({ geq, expected }) => {
    expect(topicForTrashingEstateAndAtLeastOnce5(geq)).toEqual(expected)
  })
})
