const DAY_MS = 86_400_000

// Supabase returns either "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss": only the calendar day matters.
export function parseDay(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function formatDateFR(value: string): string {
  return parseDay(value).toLocaleDateString('fr-FR', { timeZone: 'UTC' })
}

export function countNights(start: string, end: string): number {
  return Math.round((parseDay(end).getTime() - parseDay(start).getTime()) / DAY_MS)
}
