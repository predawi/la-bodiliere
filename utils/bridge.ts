import { formatTime, parisDay } from './dates'

// The Colbert bridge opens 2 h before high tide and closes 45 min after.
const OPENS_BEFORE_MS = 2 * 60 * 60_000
const CLOSES_AFTER_MS = 45 * 60_000

export interface BridgeOpening {
  highTide: Date
  opensAt: Date
  closesAt: Date
}

export interface BridgeStatus {
  isOpen: boolean
  opening: BridgeOpening | undefined
}

export function bridgeOpenings(highTides: string[]): BridgeOpening[] {
  return highTides
    .map(time => new Date(time))
    .sort((a, b) => a.getTime() - b.getTime())
    .map(highTide => ({
      highTide,
      opensAt: new Date(highTide.getTime() - OPENS_BEFORE_MS),
      closesAt: new Date(highTide.getTime() + CLOSES_AFTER_MS),
    }))
}

// The opening under way when the bridge is up, otherwise the next one.
export function bridgeStatus(highTides: string[], now: Date): BridgeStatus {
  const opening = bridgeOpenings(highTides).find(({ closesAt }) => now < closesAt)
  return { isOpen: !!opening && now >= opening.opensAt, opening }
}

export function describeBridge({ isOpen, opening }: BridgeStatus, now: Date): { title: string, detail: string } {
  if (isOpen && opening) {
    return {
      title: 'Levé, on ne peut pas traverser',
      detail: `Il redescend à ${formatTime(opening.closesAt)} · pleine mer à ${formatTime(opening.highTide)}`,
    }
  }
  if (!opening) return { title: 'Baissé, on peut traverser', detail: '' }

  const day = parisDay(opening.opensAt) === parisDay(now) ? '' : 'demain '
  return {
    title: 'Baissé, on peut traverser',
    detail: `Il se lève ${day}de ${formatTime(opening.opensAt)} à ${formatTime(opening.closesAt)}`,
  }
}
