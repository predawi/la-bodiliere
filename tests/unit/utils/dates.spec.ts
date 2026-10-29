import { describe, expect, it } from 'vitest'
import {
  addDays,
  countNights,
  formatDaysUntil,
  formatLongDate,
  formatMonth,
  formatNights,
  formatStayRange,
  formatTime,
  monthGrid,
  parisDay,
  parseDay,
} from '~/utils/dates'

describe('parseDay', () => {
  it('reads a plain date as midnight UTC', () => {
    expect(parseDay('2026-10-29').toISOString()).toBe('2026-10-29T00:00:00.000Z')
  })

  it('ignores the time part of a timestamp', () => {
    expect(parseDay('2026-10-29 23:30:00').toISOString()).toBe('2026-10-29T00:00:00.000Z')
    expect(parseDay('2026-10-29T23:30:00').toISOString()).toBe('2026-10-29T00:00:00.000Z')
  })
})

describe('parisDay', () => {
  it('uses the calendar day in Paris, not in UTC', () => {
    expect(parisDay(new Date('2026-10-28T23:30:00Z'))).toBe('2026-10-29')
    expect(parisDay(new Date('2026-07-01T21:59:00Z'))).toBe('2026-07-01')
  })
})

describe('addDays', () => {
  it('moves across months and years', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31')
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
})

describe('formatLongDate', () => {
  it('writes the weekday, day and month', () => {
    expect(formatLongDate('2026-10-29')).toBe('jeudi 29 octobre')
  })

  it('writes the first day of the month as "1er"', () => {
    expect(formatLongDate('2026-11-01')).toBe('dimanche 1er novembre')
  })

  it('can add the year', () => {
    expect(formatLongDate('2026-12-31', true)).toBe('jeudi 31 décembre 2026')
  })
})

describe('formatStayRange', () => {
  it('spells out both dates across two months', () => {
    expect(formatStayRange('2026-10-29', '2026-11-01')).toBe('Du jeudi 29 octobre au dimanche 1er novembre')
  })

  it('writes the month once within the same month', () => {
    expect(formatStayRange('2026-12-19', '2026-12-26')).toBe('Du samedi 19 au samedi 26 décembre')
  })

  it('can be used in the middle of a sentence', () => {
    expect(formatStayRange('2026-12-19', '2026-12-26', false)).toBe('du samedi 19 au samedi 26 décembre')
  })

  it('adds the years when the stay crosses new year', () => {
    expect(formatStayRange('2026-12-31', '2027-01-02')).toBe('Du jeudi 31 décembre 2026 au samedi 2 janvier 2027')
  })
})

describe('formatNights', () => {
  it('agrees with the number of nights', () => {
    expect(formatNights(1)).toBe('1 nuit')
    expect(formatNights(3)).toBe('3 nuits')
  })
})

describe('formatDaysUntil', () => {
  it('says today, tomorrow or in how many days', () => {
    expect(formatDaysUntil('2026-10-25', '2026-10-25')).toBe("Aujourd'hui")
    expect(formatDaysUntil('2026-10-25', '2026-10-26')).toBe('Demain')
    expect(formatDaysUntil('2026-10-25', '2026-10-29')).toBe('Dans 4 jours')
  })
})

describe('monthGrid', () => {
  it('starts the week on Monday', () => {
    const october = monthGrid(2026, 9)
    expect(october.leadingBlanks).toBe(3)
    expect(october.days).toHaveLength(31)
    expect(october.days[0]).toBe('2026-10-01')
  })

  it('has no blank when the month starts on a Monday', () => {
    expect(monthGrid(2026, 5).leadingBlanks).toBe(0)
  })

  it('is labelled in French', () => {
    expect(formatMonth(2026, 9)).toBe('octobre 2026')
  })
})

describe('formatTime', () => {
  it('gives the time in Paris, summer and winter', () => {
    expect(formatTime(new Date('2026-07-01T06:05:00Z'))).toBe('8h05')
    expect(formatTime(new Date('2026-12-01T16:30:00Z'))).toBe('17h30')
  })

  it('writes midnight as 0 h', () => {
    expect(formatTime(new Date('2026-12-01T23:10:00Z'))).toBe('0h10')
  })
})
