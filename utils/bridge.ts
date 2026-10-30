import { formatTime, parisDay } from './dates'

// The Colbert bridge opens for about 5 min to let boats through, 2 h before high tide and again 45 min after.
const OPENING_OFFSETS_MS = [-2 * 60 * 60_000, 45 * 60_000]
const OPENING_MS = 5 * 60_000

export interface BridgeStatus {
  isOpen: boolean
  // The opening under way first when the bridge is up, then the next ones.
  openings: Date[]
}

export function bridgeOpenings(highTides: string[]): Date[] {
  return highTides
    .flatMap(time => OPENING_OFFSETS_MS.map(offset => new Date(new Date(time).getTime() + offset)))
    .sort((a, b) => a.getTime() - b.getTime())
}

export function bridgeStatus(highTides: string[], now: Date): BridgeStatus {
  const openings = bridgeOpenings(highTides).filter(opening => now.getTime() < opening.getTime() + OPENING_MS)
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
      title: 'Levé, on ne peut pas traverser',
      detail: `Il redescend vers ${formatTime(new Date(first.getTime() + OPENING_MS))}`,
    }
  }

  const title = 'Baissé, on peut traverser'
  if (!first) return { title, detail: '' }
  if (!second) return { title, detail: `Il s'ouvrira ${at(first, now)}` }
  return { title, detail: `Il s'ouvrira une fois ${at(first, now)} et une fois ${at(second, first)}` }
}
