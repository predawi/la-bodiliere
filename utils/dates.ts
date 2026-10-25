const DAY_MS = 86_400_000
const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

// Supabase returns either "YYYY-MM-DD" or "YYYY-MM-DD HH:mm:ss": only the calendar day matters.
export function dayOf(value: string): string {
  return value.slice(0, 10)
}

export function parseDay(value: string): Date {
  const [year, month, day] = dayOf(value).split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

// The server runs in UTC: the house's day is the one in Paris.
export function parisDay(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(date)
}

export function addDays(value: string, days: number): string {
  const date = parseDay(value)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function countNights(start: string, end: string): number {
  return Math.round((parseDay(end).getTime() - parseDay(start).getTime()) / DAY_MS)
}

function dayNumber(date: Date): string {
  return date.getUTCDate() === 1 ? '1er' : String(date.getUTCDate())
}

export function formatLongDate(value: string, withYear = false): string {
  const date = parseDay(value)
  const year = withYear ? ` ${date.getUTCFullYear()}` : ''
  return `${WEEKDAYS[date.getUTCDay()]} ${dayNumber(date)} ${MONTHS[date.getUTCMonth()]}${year}`
}

export function formatStayRange(start: string, end: string, startsSentence = true): string {
  const from = parseDay(start)
  const to = parseDay(end)
  const sameYear = from.getUTCFullYear() === to.getUTCFullYear()
  const du = startsSentence ? 'Du' : 'du'

  if (sameYear && from.getUTCMonth() === to.getUTCMonth()) {
    return `${du} ${WEEKDAYS[from.getUTCDay()]} ${dayNumber(from)} au ${formatLongDate(end)}`
  }
  return `${du} ${formatLongDate(start, !sameYear)} au ${formatLongDate(end, !sameYear)}`
}

export function formatNights(nights: number): string {
  return `${nights} ${nights > 1 ? 'nuits' : 'nuit'}`
}

export function formatDaysUntil(today: string, day: string): string {
  const days = countNights(today, day)
  if (days <= 0) return "Aujourd'hui"
  if (days === 1) return 'Demain'
  return `Dans ${days} jours`
}

export function formatMonth(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export interface MonthGrid {
  leadingBlanks: number
  days: string[]
}

export function monthGrid(year: number, month: number): MonthGrid {
  const first = new Date(Date.UTC(year, month, 1))
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const days = Array.from({ length: count }, (_, i) => new Date(Date.UTC(year, month, i + 1)).toISOString().slice(0, 10))
  return { leadingBlanks: (first.getUTCDay() + 6) % 7, days }
}
