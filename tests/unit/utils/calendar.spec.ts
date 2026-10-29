import { describe, expect, it } from 'vitest'
import { bookingIcs, googleCalendarUrl, icsDataUrl, icsFileUrl, stayFromQuery } from '~/utils/calendar'

const stay = { name: 'Mamie & Papi', start_date: '2026-11-07', end_date: '2026-11-10' }
const site = 'https://bodiliere.netlify.app'

describe('googleCalendarUrl', () => {
  it('builds an all-day event that includes the departure day', () => {
    const url = new URL(googleCalendarUrl(stay, site))

    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render')
    expect(url.searchParams.get('action')).toBe('TEMPLATE')
    expect(url.searchParams.get('text')).toBe('Séjour à La Bodilière')
    expect(url.searchParams.get('dates')).toBe('20261107/20261111')
    expect(url.searchParams.get('details')).toBe(`Mamie & Papi · 3 nuits\n${site}`)
  })

  it('crosses months and years', () => {
    const url = new URL(googleCalendarUrl({ ...stay, start_date: '2026-12-30', end_date: '2026-12-31 00:00:00' }, site))
    expect(url.searchParams.get('dates')).toBe('20261230/20270101')
  })
})

describe('bookingIcs', () => {
  const ics = bookingIcs(stay, site, new Date('2026-10-29T08:15:30.123Z'))
  const lines = ics.split('\r\n')

  it('describes the stay as an all-day event', () => {
    expect(lines).toContain('DTSTART;VALUE=DATE:20261107')
    expect(lines).toContain('DTEND;VALUE=DATE:20261111')
    expect(lines).toContain('DTSTAMP:20261029T081530Z')
    expect(lines).toContain('SUMMARY:Séjour à La Bodilière')
    expect(lines[0]).toBe('BEGIN:VCALENDAR')
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
  })

  it('escapes the characters that would break the file', () => {
    const tricky = bookingIcs({ ...stay, name: 'Lou, Benj; et\\ les autres' }, site)
    expect(tricky).toContain(`DESCRIPTION:Lou\\, Benj\\; et\\\\ les autres · 3 nuits\\n${site}`)
    expect(tricky).toContain('LOCATION:La Bodilière\\, près de Dieppe')
  })

  it('counts a single night', () => {
    expect(bookingIcs({ ...stay, end_date: '2026-11-08' }, site)).toContain('· 1 nuit\\n')
  })
})

describe('icsDataUrl', () => {
  it('encodes the file in a link the browser can download', () => {
    const url = icsDataUrl('A,B\r\n')
    expect(url).toBe('data:text/calendar;charset=utf-8,A%2CB%0D%0A')
  })
})

describe('icsFileUrl', () => {
  it('points to the server route with the stay in the query', () => {
    const url = new URL(icsFileUrl({ ...stay, end_date: '2026-11-10 00:00:00' }, `${site}/`))

    expect(url.origin + url.pathname).toBe(`${site}/api/calendar.ics`)
    expect(stayFromQuery(Object.fromEntries(url.searchParams))).toEqual(stay)
  })
})

describe('stayFromQuery', () => {
  const query = { name: ' Mamie & Papi ', start: '2026-11-07', end: '2026-11-10' }

  it('reads a valid stay and trims the name', () => {
    expect(stayFromQuery(query)).toEqual(stay)
  })

  it('accepts a single night', () => {
    expect(stayFromQuery({ ...query, end: '2026-11-08' })).not.toBeNull()
  })

  it.each([
    ['a missing name', { ...query, name: undefined }],
    ['a blank name', { ...query, name: '   ' }],
    ['a name that is too long', { ...query, name: 'a'.repeat(101) }],
    ['a repeated parameter', { ...query, start: ['2026-11-07', '2026-11-08'] }],
    ['a malformed date', { ...query, start: '07/11/2026' }],
    ['a day that does not exist', { ...query, end: '2026-11-31' }],
    ['a departure on the arrival day', { ...query, end: '2026-11-07' }],
    ['a departure before the arrival', { ...query, start: '2026-11-10', end: '2026-11-07' }],
  ])('refuses %s', (_, invalid) => {
    expect(stayFromQuery(invalid)).toBeNull()
  })
})
