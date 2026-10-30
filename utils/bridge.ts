import { addDays, formatTime, parisDay, parisTime } from './dates'

// Harbour master's notice of 8 July 2026: the Colbert bridge opens for about 5 min, only when boats are waiting,
// 2 h and 45 min before each high tide, 45 min after, and every day at 7h30 and 18h30.
const TIDE_OFFSETS_MS = [-120, -45, 45].map(minutes => minutes * 60_000)
const FIXED_TIMES = [[7, 30], [18, 30]] as const
const OPENING_MS = 5 * 60_000

export interface BridgeStatus {
  isOpen: boolean
  // The opening under way first when the bridge may be up, then the next ones.
  openings: Date[]
}

export function bridgeOpenings(highTides: string[], days: string[]): Date[] {
  const tideOpenings = highTides.flatMap(time => TIDE_OFFSETS_MS.map(offset => new Date(new Date(time).getTime() + offset)))
  const fixedOpenings = days.flatMap(day => FIXED_TIMES.map(([hours, minutes]) => parisTime(day, hours, minutes)))
  return [...tideOpenings, ...fixedOpenings]
    .sort((a, b) => a.getTime() - b.getTime())
    // A fixed opening that falls during a tide opening is the same manoeuvre.
    .filter((opening, i, sorted) => i === 0 || opening.getTime() - sorted[i - 1]!.getTime() >= OPENING_MS)
}

export function bridgeStatus(highTides: string[], now: Date): BridgeStatus {
  const today = parisDay(now)
  const openings = bridgeOpenings(highTides, [today, addDays(today, 1)])
    .filter(opening => now.getTime() < opening.getTime() + OPENING_MS)
  return { isOpen: !!openings[0] && now >= openings[0], openings }
}

function at(opening: Date, previous: Date): string {
  const day = parisDay(opening) === parisDay(previous) ? '' : 'demain '
  return `${day}à ${formatTime(opening)}`
}

export function describeBridge({ isOpen, openings }: BridgeStatus, now: Date): { title: string, detail: string } {
  const [first, second] = openings
  if (isOpen && first) {
    return {
      title: "Levé s'il y a des bateaux",
      detail: `Il redescend vers ${formatTime(new Date(first.getTime() + OPENING_MS))}`,
    }
  }

  const title = 'Baissé, on peut traverser'
  if (!first || !second) return { title, detail: '' }
  return { title, detail: `S'il y a des bateaux, il se lèvera ${at(first, now)} puis ${at(second, first)}` }
}
