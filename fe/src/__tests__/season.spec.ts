import { getAnimeSeason } from '@/lib/season'

describe('getAnimeSeason', () => {
  it.each([
    ['2026-01-15T00:00:00', 'winter-2026'],
    ['2026-04-15T00:00:00', 'spring-2026'],
    ['2026-08-10T00:00:00', 'summer-2026'],
    ['2026-11-15T00:00:00', 'fall-2026'],
  ])('maps %s to %s', (value, expected) => {
    expect(getAnimeSeason(new Date(value)).slug).toBe(expected)
  })
})
