import {
  all,
  any,
  atLeastOnce,
  atLeastOnce5,
  atLeastOnce6,
  atLeastOnce7,
  both,
  both5,
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

describe('atLeastOnce6', () => {
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
