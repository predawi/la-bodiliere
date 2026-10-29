import type { NewBooking } from './bookings'
import { addDays, countNights, dayOf, formatNights } from './dates'

const TITLE = 'Séjour à La Bodilière'
const LOCATION = 'La Bodilière, près de Dieppe'

function compactDay(value: string): string {
  return dayOf(value).replace(/-/g, '')
}

function details(booking: NewBooking, siteUrl: string): string {
  const nights = formatNights(countNights(booking.start_date, booking.end_date))
  return `${booking.name} · ${nights}\n${siteUrl}`
}

// All-day events end on the following day (exclusive): +1 keeps the departure day in the calendar.
function eventDays(booking: NewBooking) {
  return { start: compactDay(booking.start_date), end: compactDay(addDays(booking.end_date, 1)) }
}

export function googleCalendarUrl(booking: NewBooking, siteUrl: string): string {
  const { start, end } = eventDays(booking)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    dates: `${start}/${end}`,
    details: details(booking, siteUrl),
    location: LOCATION,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

function escapeIcs(value: string): string {
  return value.replace(/[\\;,]/g, (char) => `\\${char}`).replace(/\n/g, '\\n')
}

export function bookingIcs(booking: NewBooking, siteUrl: string, now = new Date()): string {
  const { start, end } = eventDays(booking)
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//La Bodiliere//Reservations//FR',
    'BEGIN:VEVENT',
    `UID:${start}-${end}@bodiliere`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeIcs(TITLE)}`,
    `DESCRIPTION:${escapeIcs(details(booking, siteUrl))}`,
    `LOCATION:${escapeIcs(LOCATION)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}

export function icsDataUrl(ics: string): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}

// Email clients block data: links, so the e-mail points to a server route that rebuilds the file.
export function icsFileUrl(booking: NewBooking, siteUrl: string): string {
  const params = new URLSearchParams({ name: booking.name, start: dayOf(booking.start_date), end: dayOf(booking.end_date) })
  return `${siteUrl.replace(/\/$/, '')}/api/calendar.ics?${params}`
}

const DAY = /^\d{4}-\d{2}-\d{2}$/
const MAX_NAME_LENGTH = 100

function isRealDay(value: string): boolean {
  return DAY.test(value) && addDays(value, 0) === value
}

export function stayFromQuery(query: Record<string, unknown>): NewBooking | null {
  const { name, start, end } = query
  if (typeof name !== 'string' || typeof start !== 'string' || typeof end !== 'string') return null
  const trimmed = name.trim()
  if (!trimmed || trimmed.length > MAX_NAME_LENGTH) return null
  if (!isRealDay(start) || !isRealDay(end) || countNights(start, end) < 1) return null
  return { name: trimmed, start_date: start, end_date: end }
}
