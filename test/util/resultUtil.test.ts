import {
  all,
  any,
  atLeastOnce,
  atLeastOnce5,
  atLeastOnce6,
  atLeastOnce7,
  both,
  both5,
  resultOfAll,
  resultOfAny,
  resultOfAtLeastOnce,
  resultOfAtLeastOnce5,
  resultOfAtLeastOnce6,
  resultOfAtLeastOnce7,
  resultOfBoth,
  resultOfBoth5,
  resultOfBothAndAtLeastOnce,
  resultOfTrashingEstate,
  resultOfTrashingEstateAndAtLeastOnce,
  resultOfTrashingEstateAndAtLeastOnce5,
  trashingEstate,
} from '@/util/resultUtil'

describe('any', () => {
  it.each([
    { cond: 'turn3 is true', t3: { key: true }, t4: { key: false }, expected: true },
    { cond: 'turn4 is true', t3: { key: false }, t4: { key: true }, expected: true },
    { cond: 'both are true', t3: { key: true }, t4: { key: true }, expected: true },
    { cond: 'both are false', t3: { key: false }, t4: { key: false }, expected: false },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(any(t3, t4, 'key')).toEqual(expected)
  })
})

describe('all', () => {
  it.each([
    { cond: 'turn3 is true', t3: { key: true }, t4: { key: false }, expected: false },
    { cond: 'turn4 is true', t3: { key: false }, t4: { key: true }, expected: false },
    { cond: 'both are true', t3: { key: true }, t4: { key: true }, expected: true },
    { cond: 'both are false', t3: { key: false }, t4: { key: false }, expected: false },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(all(t3, t4, 'key')).toEqual(expected)
  })
})

describe('atLeastOnce', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 5 }, t4: { coin: 4 }, expected: true },
    { cond: 'turn4 reaches threshold', t3: { coin: 4 }, t4: { coin: 5 }, expected: true },
    { cond: 'both reach threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: true },
    { cond: 'both do not reache threshold', t3: { coin: 4 }, t4: { coin: 4 }, expected: false },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(atLeastOnce(t3, t4, 5)).toEqual(expected)
  })
})

describe('atLeastOnce5', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 5 }, t4: { coin: 4 }, expected: true },
    { cond: 'turn4 reaches threshold', t3: { coin: 4 }, t4: { coin: 5 }, expected: true },
    { cond: 'both reach threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: true },
    { cond: 'both do not reache threshold', t3: { coin: 4 }, t4: { coin: 4 }, expected: false },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(atLeastOnce5(t3, t4)).toEqual(expected)
  })
})

describe('atLeastOnce6', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 6 }, t4: { coin: 5 }, expected: true },
    { cond: 'turn4 reaches threshold', t3: { coin: 5 }, t4: { coin: 6 }, expected: true },
    { cond: 'both reach threshold', t3: { coin: 6 }, t4: { coin: 6 }, expected: true },
    { cond: 'both do not reache threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: false },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(atLeastOnce6(t3, t4)).toEqual(expected)
  })
})

describe('atLeastOnce7', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 7 }, t4: { coin: 6 }, expected: true },
    { cond: 'turn4 reaches threshold', t3: { coin: 6 }, t4: { coin: 7 }, expected: true },
    { cond: 'both reach threshold', t3: { coin: 7 }, t4: { coin: 7 }, expected: true },
    { cond: 'both do not reache threshold', t3: { coin: 6 }, t4: { coin: 6 }, expected: false },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(atLeastOnce7(t3, t4)).toEqual(expected)
  })
})

describe('both', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 5 }, t4: { coin: 4 }, expected: false },
    { cond: 'turn4 reaches threshold', t3: { coin: 4 }, t4: { coin: 5 }, expected: false },
    { cond: 'both reach threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: true },
    { cond: 'both do not reache threshold', t3: { coin: 4 }, t4: { coin: 4 }, expected: false },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(both(t3, t4, 5)).toEqual(expected)
  })
})

describe('both5', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 5 }, t4: { coin: 4 }, expected: false },
    { cond: 'turn4 reaches threshold', t3: { coin: 4 }, t4: { coin: 5 }, expected: false },
    { cond: 'both reach threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: true },
    { cond: 'both do not reache threshold', t3: { coin: 4 }, t4: { coin: 4 }, expected: false },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(both5(t3, t4)).toEqual(expected)
  })
})

describe('trashingEstate', () => {
  it.each([
    { cond: 'turn3 is true', t3: { trashingEstate: true }, t4: { trashingEstate: false }, expected: true },
    { cond: 'turn4 is true', t3: { trashingEstate: false }, t4: { trashingEstate: true }, expected: true },
    { cond: 'both are true', t3: { trashingEstate: true }, t4: { trashingEstate: true }, expected: true },
    { cond: 'both are false', t3: { trashingEstate: false }, t4: { trashingEstate: false }, expected: false },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(trashingEstate(t3, t4)).toEqual(expected)
  })
})

describe('resultOfAny', () => {
  it.each([
    { cond: 'turn3 is true', t3: { key: true }, t4: { key: false }, expected: { key: true } },
    { cond: 'turn4 is true', t3: { key: false }, t4: { key: true }, expected: { key: true } },
    { cond: 'both are true', t3: { key: true }, t4: { key: true }, expected: { key: true } },
    { cond: 'both are false', t3: { key: false }, t4: { key: false }, expected: { key: false } },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfAny(t3, t4, 'key')).toEqual(expected)
  })
})

describe('resultOfAll', () => {
  it.each([
    { cond: 'turn3 is true', t3: { key: true }, t4: { key: false }, expected: { key: false } },
    { cond: 'turn4 is true', t3: { key: false }, t4: { key: true }, expected: { key: false } },
    { cond: 'both are true', t3: { key: true }, t4: { key: true }, expected: { key: true } },
    { cond: 'both are false', t3: { key: false }, t4: { key: false }, expected: { key: false } },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfAll(t3, t4, 'key')).toEqual(expected)
  })
})

describe('resultOfAtLeastOnce', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 5 }, t4: { coin: 4 }, expected: { atLeastOnce5: true } },
    { cond: 'turn4 reaches threshold', t3: { coin: 4 }, t4: { coin: 5 }, expected: { atLeastOnce5: true } },
    { cond: 'both reach threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: { atLeastOnce5: true } },
    { cond: 'both do not reache threshold', t3: { coin: 4 }, t4: { coin: 4 }, expected: { atLeastOnce5: false } },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfAtLeastOnce(t3, t4, 5)).toEqual(expected)
  })
})

describe('resultOfAtLeastOnce5', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 5 }, t4: { coin: 4 }, expected: { atLeastOnce5: true } },
    { cond: 'turn4 reaches threshold', t3: { coin: 4 }, t4: { coin: 5 }, expected: { atLeastOnce5: true } },
    { cond: 'both reach threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: { atLeastOnce5: true } },
    { cond: 'both do not reache threshold', t3: { coin: 4 }, t4: { coin: 4 }, expected: { atLeastOnce5: false } },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfAtLeastOnce5(t3, t4)).toEqual(expected)
  })
})

describe('resultOfAtLeastOnce6', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 6 }, t4: { coin: 5 }, expected: { atLeastOnce6: true } },
    { cond: 'turn4 reaches threshold', t3: { coin: 5 }, t4: { coin: 6 }, expected: { atLeastOnce6: true } },
    { cond: 'both reach threshold', t3: { coin: 6 }, t4: { coin: 6 }, expected: { atLeastOnce6: true } },
    { cond: 'both do not reache threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: { atLeastOnce6: false } },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfAtLeastOnce6(t3, t4)).toEqual(expected)
  })
})

describe('resultOfAtLeastOnce7', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 7 }, t4: { coin: 6 }, expected: { atLeastOnce7: true } },
    { cond: 'turn4 reaches threshold', t3: { coin: 6 }, t4: { coin: 7 }, expected: { atLeastOnce7: true } },
    { cond: 'both reach threshold', t3: { coin: 7 }, t4: { coin: 7 }, expected: { atLeastOnce7: true } },
    { cond: 'both do not reache threshold', t3: { coin: 6 }, t4: { coin: 6 }, expected: { atLeastOnce7: false } },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfAtLeastOnce7(t3, t4)).toEqual(expected)
  })
})

describe('resultOfBoth', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 5 }, t4: { coin: 4 }, expected: { both5: false } },
    { cond: 'turn4 reaches threshold', t3: { coin: 4 }, t4: { coin: 5 }, expected: { both5: false } },
    { cond: 'both reach threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: { both5: true } },
    { cond: 'both do not reache threshold', t3: { coin: 4 }, t4: { coin: 4 }, expected: { both5: false } },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfBoth(t3, t4, 5)).toEqual(expected)
  })
})

describe('resultOfBoth5', () => {
  it.each([
    { cond: 'turn3 reaches threshold', t3: { coin: 5 }, t4: { coin: 4 }, expected: { both5: false } },
    { cond: 'turn4 reaches threshold', t3: { coin: 4 }, t4: { coin: 5 }, expected: { both5: false } },
    { cond: 'both reach threshold', t3: { coin: 5 }, t4: { coin: 5 }, expected: { both5: true } },
    { cond: 'both do not reache threshold', t3: { coin: 4 }, t4: { coin: 4 }, expected: { both5: false } },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfBoth5(t3, t4)).toEqual(expected)
  })
})

describe('resultOfBothAndAtLeastOnce', () => {
  it.each([
    {
      cond: 'reaches both coin threshold only',
      t3: { coin: 5 },
      t4: { coin: 5 },
      expected: { both5AndAtLeastOnce6: false },
    },
    {
      cond: 'reaches at least once coin threshold only',
      t3: { coin: 6 },
      t4: { coin: 4 },
      expected: { both5AndAtLeastOnce6: false },
    },
    { cond: 'reaches both thresholds', t3: { coin: 5 }, t4: { coin: 6 }, expected: { both5AndAtLeastOnce6: true } },
    {
      cond: 'both do not reache threshold',
      t3: { coin: 5 },
      t4: { coin: 4 },
      expected: { both5AndAtLeastOnce6: false },
    },
  ])('when $cond returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfBothAndAtLeastOnce(t3, t4, 5, 6)).toEqual(expected)
  })
})

describe('resultOfTrashingEstate', () => {
  it.each([
    {
      cond: 'turn3 is true',
      t3: { trashingEstate: true },
      t4: { trashingEstate: false },
      expected: { trashingEstate: true },
    },
    {
      cond: 'turn4 is true',
      t3: { trashingEstate: false },
      t4: { trashingEstate: true },
      expected: { trashingEstate: true },
    },
    {
      cond: 'both are true',
      t3: { trashingEstate: true },
      t4: { trashingEstate: true },
      expected: { trashingEstate: true },
    },
    {
      cond: 'both are false',
      t3: { trashingEstate: false },
      t4: { trashingEstate: false },
      expected: { trashingEstate: false },
    },
  ])('when $cond, returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfTrashingEstate(t3, t4)).toEqual(expected)
  })
})

describe('resultOfTrashingEstateAndAtLeastOnce', () => {
  it.each([
    {
      cond: 'only trashing estate is satisfied',
      t3: { trashingEstate: true, coin: 4 },
      t4: { trashingEstate: false, coin: 4 },
      expected: { trashingEstateAndAtLeastOnce5: false },
    },
    {
      cond: 'only at least once coin is satisfied',
      t3: { trashingEstate: false, coin: 4 },
      t4: { trashingEstate: false, coin: 5 },
      expected: { trashingEstateAndAtLeastOnce5: false },
    },
    {
      cond: 'both are satisfied',
      t3: { trashingEstate: true, coin: 4 },
      t4: { trashingEstate: false, coin: 5 },
      expected: { trashingEstateAndAtLeastOnce5: true },
    },
    {
      cond: 'both are not satisfied',
      t3: { trashingEstate: false, coin: 4 },
      t4: { trashingEstate: false, coin: 4 },
      expected: { trashingEstateAndAtLeastOnce5: false },
    },
  ])('when $cond returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfTrashingEstateAndAtLeastOnce(t3, t4, 5)).toEqual(expected)
  })
})

describe('resultOfTrashingEstateAndAtLeastOnce5', () => {
  it.each([
    {
      cond: 'only trashing estate is satisfied',
      t3: { trashingEstate: true, coin: 4 },
      t4: { trashingEstate: false, coin: 4 },
      expected: { trashingEstateAndAtLeastOnce5: false },
    },
    {
      cond: 'only at least once coin is satisfied',
      t3: { trashingEstate: false, coin: 4 },
      t4: { trashingEstate: false, coin: 5 },
      expected: { trashingEstateAndAtLeastOnce5: false },
    },
    {
      cond: 'both are satisfied',
      t3: { trashingEstate: true, coin: 4 },
      t4: { trashingEstate: false, coin: 5 },
      expected: { trashingEstateAndAtLeastOnce5: true },
    },
    {
      cond: 'both are not satisfied',
      t3: { trashingEstate: false, coin: 4 },
      t4: { trashingEstate: false, coin: 4 },
      expected: { trashingEstateAndAtLeastOnce5: false },
    },
  ])('when $cond returns $expected', ({ t3, t4, expected }) => {
    expect(resultOfTrashingEstateAndAtLeastOnce5(t3, t4)).toEqual(expected)
  })
})
