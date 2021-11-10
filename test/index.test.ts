import { add } from '@/index'

describe('add', () => {
  it('returns sum', () => {
    expect(add(1, 2)).toEqual(3)
  })
})
