import { describe, expect, it } from 'vitest'
import {
  type Booking,
  bookingStats,
  checkStay,
  describeHouseStatus,
  findOverlap,
  houseStatus,
  isDepartureDay,
  isNightBooked,
  upcomingBookings,
} from '~/utils/bookings'

const louEtBenj: Booking = { id: 1, name: 'Lou & Benj', start_date: '2026-10-29', end_date: '2026-11-01' }
const martin: Booking = { id: 2, name: 'Les Martin', start_date: '2026-11-14', end_date: '2026-11-15' }
const past: Booking = { id: 3, name: 'Mamie & Papi', start_date: '2026-08-01', end_date: '2026-08-28' }
const bookings = [martin, past, louEtBenj]

describe('upcomingBookings', () => {
  it('keeps stays that are not over, sorted by arrival', () => {
    expect(upcomingBookings(bookings, '2026-10-25')).toEqual([louEtBenj, martin])
  })

  it('drops a stay on its departure day', () => {
    expect(upcomingBookings([louEtBenj], '2026-11-01')).toEqual([])
  })
})

describe('isNightBooked', () => {
  it('books the arrival night but not the departure one', () => {
    expect(isNightBooked(bookings, '2026-10-29')).toBe(true)
    expect(isNightBooked(bookings, '2026-10-31')).toBe(true)
    expect(isNightBooked(bookings, '2026-11-01')).toBe(false)
  })
})

describe('isDepartureDay', () => {
  it('flags the day a stay ends', () => {
    expect(isDepartureDay(bookings, '2026-11-01')).toBe(true)
    expect(isDepartureDay(bookings, '2026-10-31')).toBe(false)
  })
})

describe('findOverlap', () => {
  it('finds a stay sharing at least one night', () => {
    expect(findOverlap(bookings, '2026-10-30', '2026-11-02')).toBe(louEtBenj)
  })

  it('allows arriving the day the others leave', () => {
    expect(findOverlap(bookings, '2026-11-01', '2026-11-03')).toBeUndefined()
  })

  it('allows leaving the day the others arrive', () => {
    expect(findOverlap(bookings, '2026-10-26', '2026-10-29')).toBeUndefined()
  })

  it('handles timestamps returned by Supabase', () => {
    const stored = { ...louEtBenj, start_date: '2026-10-29 00:00:00', end_date: '2026-11-01 00:00:00' }
    expect(findOverlap([stored], '2026-10-31', '2026-11-02')).toBe(stored)
  })
})

describe('checkStay', () => {
  const today = '2026-10-25'

  it('waits for both dates', () => {
    expect(checkStay(bookings, today, '2026-11-07', '')).toEqual({ state: 'incomplete' })
  })

  it('refuses an arrival in the past, even before the departure is set', () => {
    expect(checkStay(bookings, today, '2026-10-01', '')).toEqual({ state: 'past' })
  })

  it('accepts an arrival today', () => {
    expect(checkStay(bookings, today, today, '2026-10-27')).toEqual({ state: 'free', nights: 2 })
  })

  it('refuses a departure on or before the arrival', () => {
    expect(checkStay(bookings, today, '2026-11-10', '2026-11-07')).toEqual({ state: 'order' })
    expect(checkStay(bookings, today, '2026-11-10', '2026-11-10')).toEqual({ state: 'order' })
  })

  it('reports the stay that overlaps', () => {
    expect(checkStay(bookings, today, '2026-10-30', '2026-11-02')).toEqual({ state: 'overlap', booking: louEtBenj })
  })

  it('counts the nights of a free stay', () => {
    expect(checkStay(bookings, today, '2026-11-07', '2026-11-10')).toEqual({ state: 'free', nights: 3 })
  })
})

describe('bookingStats', () => {
  it('counts stays, nights and the longest stay', () => {
    expect(bookingStats(bookings)).toEqual({ count: 3, totalNights: 31, longestStay: 27 })
  })

  it('returns zeros without bookings', () => {
    expect(bookingStats([])).toEqual({ count: 0, totalNights: 0, longestStay: 0 })
  })
})

describe('houseStatus', () => {
  it('is free with the next arrival before a stay', () => {
    expect(houseStatus(bookings, '2026-10-25')).toEqual({ state: 'free', next: louEtBenj })
  })

  it('is occupied during a stay', () => {
    expect(houseStatus(bookings, '2026-10-30')).toEqual({ state: 'occupied', booking: louEtBenj })
  })

  it('is free with nothing planned', () => {
    expect(houseStatus([past], '2026-10-25')).toEqual({ state: 'free', next: null })
  })
})

describe('describeHouseStatus', () => {
  it('says until when the house is free', () => {
    expect(describeHouseStatus({ state: 'free', next: louEtBenj }, '2026-10-25')).toEqual({
      title: "La maison est libre jusqu'au mercredi 28 octobre.",
      detail: 'Prochaine arrivée : Lou & Benj, jeudi 29 octobre.',
    })
  })

  it('says "ce soir" when the next arrival is tomorrow', () => {
    expect(describeHouseStatus({ state: 'free', next: louEtBenj }, '2026-10-28').title).toBe('La maison est libre ce soir.')
  })

  it('names who is staying', () => {
    expect(describeHouseStatus({ state: 'occupied', booking: louEtBenj }, '2026-10-30')).toEqual({
      title: "La maison est occupée jusqu'au dimanche 1er novembre.",
      detail: 'En ce moment : Lou & Benj.',
    })
  })

  it('has a sentence when nothing is planned', () => {
    expect(describeHouseStatus({ state: 'free', next: null }, '2026-10-25').title).toBe('La maison est libre.')
  })
})
