import { describe, expect, it } from 'vitest'
import { countNights, formatDateFR, parseDay } from '~/utils/dates'

describe('parseDay', () => {
  it('reads a plain date as midnight UTC', () => {
    expect(parseDay('2026-10-29').toISOString()).toBe('2026-10-29T00:00:00.000Z')
  })

  it('ignores the time part of a timestamp', () => {
    expect(parseDay('2026-10-29 23:30:00').toISOString()).toBe('2026-10-29T00:00:00.000Z')
    expect(parseDay('2026-10-29T23:30:00').toISOString()).toBe('2026-10-29T00:00:00.000Z')
  })
})

describe('formatDateFR', () => {
  it('formats a day as dd/mm/yyyy', () => {
    expect(formatDateFR('2026-11-01')).toBe('01/11/2026')
  })

  it('keeps the calendar day of a late timestamp', () => {
    expect(formatDateFR('2026-10-31T23:59:00')).toBe('31/10/2026')
  })
})

describe('countNights', () => {
  it('counts the nights between arrival and departure', () => {
    expect(countNights('2026-10-29', '2026-11-01')).toBe(3)
  })

  it('counts a single night', () => {
    expect(countNights('2026-11-14', '2026-11-15')).toBe(1)
  })

  it('is not affected by the daylight saving change', () => {
    expect(countNights('2026-10-24', '2026-10-26')).toBe(2)
  })

  it('returns 0 when arrival and departure are the same day', () => {
    expect(countNights('2026-12-19', '2026-12-19')).toBe(0)
  })
})
