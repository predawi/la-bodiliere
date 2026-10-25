import { addDays, countNights, dayOf, formatLongDate, formatNights, formatStayRange } from './dates'

export interface Booking {
  id: number
  name: string
  start_date: string
  end_date: string
}

export type NewBooking = Omit<Booking, 'id'>

export type HouseStatus =
  | { state: 'occupied', booking: Booking }
  | { state: 'free', next: Booking | null }

export function isInProgress(booking: Booking, today: string): boolean {
  return dayOf(booking.start_date) <= today && today < dayOf(booking.end_date)
}

export function upcomingBookings(bookings: Booking[], today: string): Booking[] {
  return bookings
    .filter(booking => dayOf(booking.end_date) > today)
    .sort((a, b) => dayOf(a.start_date).localeCompare(dayOf(b.start_date)))
}

// A booking covers its nights: from the arrival day up to the day before departure.
export function isNightBooked(bookings: Booking[], day: string): boolean {
  return bookings.some(booking => dayOf(booking.start_date) <= day && day < dayOf(booking.end_date))
}

export function findOverlap(bookings: Booking[], start: string, end: string): Booking | undefined {
  return bookings.find(booking => dayOf(booking.start_date) < end && dayOf(booking.end_date) > start)
}

export type StayCheck =
  | { state: 'incomplete' }
  | { state: 'past' }
  | { state: 'order' }
  | { state: 'overlap', booking: Booking }
  | { state: 'free', nights: number }

export function checkStay(bookings: Booking[], today: string, start: string, end: string): StayCheck {
  if (start && start < today) return { state: 'past' }
  if (start && end && end <= start) return { state: 'order' }
  if (!start || !end) return { state: 'incomplete' }

  const booking = findOverlap(bookings, start, end)
  return booking ? { state: 'overlap', booking } : { state: 'free', nights: countNights(start, end) }
}

export function bookingEmail(booking: NewBooking) {
  const range = formatStayRange(booking.start_date, booking.end_date, false)
  const nights = formatNights(countNights(booking.start_date, booking.end_date))
  return {
    subject: `Nouveau séjour : ${booking.name}`,
    text: `${booking.name} a réservé la maison ${range} (${nights}).`,
  }
}

export function bookingStats(bookings: Booking[]) {
  const nights = bookings.map(booking => countNights(booking.start_date, booking.end_date))
  return {
    count: bookings.length,
    totalNights: nights.reduce((sum, n) => sum + n, 0),
    longestStay: Math.max(0, ...nights),
  }
}

export function houseStatus(bookings: Booking[], today: string): HouseStatus {
  const upcoming = upcomingBookings(bookings, today)
  const current = upcoming.find(booking => isInProgress(booking, today))
  return current ? { state: 'occupied', booking: current } : { state: 'free', next: upcoming[0] ?? null }
}

export function describeHouseStatus(status: HouseStatus, today: string) {
  if (status.state === 'occupied') {
    return {
      title: `La maison est occupée jusqu'au ${formatLongDate(status.booking.end_date)}.`,
      detail: `En ce moment : ${status.booking.name}.`,
    }
  }
  if (!status.next) {
    return { title: 'La maison est libre.', detail: 'Aucun séjour prévu pour le moment.' }
  }

  const lastFreeNight = addDays(status.next.start_date, -1)
  return {
    title: lastFreeNight === today
      ? 'La maison est libre ce soir.'
      : `La maison est libre jusqu'au ${formatLongDate(lastFreeNight)}.`,
    detail: `Prochaine arrivée : ${status.next.name}, ${formatLongDate(status.next.start_date)}.`,
  }
}
