import { describe, expect, it } from 'vitest'
import { bridgeStatus, describeBridge } from '~/utils/bridge'

// High tides at 13h16 and 1h41 (the next night), Paris time.
const highTides = ['2026-10-30T00:41:00Z', '2026-10-29T12:16:00Z']

const describeAt = (now: string, tides = highTides) => describeBridge(bridgeStatus(tides, new Date(now)), new Date(now))

describe('bridgeStatus', () => {
  it('is down before the opening, with the next high tide', () => {
    const status = bridgeStatus(highTides, new Date('2026-10-29T09:00:00Z'))
    expect(status.isOpen).toBe(false)
    expect(status.opening?.highTide.toISOString()).toBe('2026-10-29T12:16:00.000Z')
  })

  it('opens exactly 2 h before high tide', () => {
    expect(bridgeStatus(highTides, new Date('2026-10-29T10:15:59Z')).isOpen).toBe(false)
    expect(bridgeStatus(highTides, new Date('2026-10-29T10:16:00Z')).isOpen).toBe(true)
  })

  it('closes exactly 45 min after high tide and moves on to the next one', () => {
    expect(bridgeStatus(highTides, new Date('2026-10-29T13:00:59Z')).isOpen).toBe(true)

    const status = bridgeStatus(highTides, new Date('2026-10-29T13:01:00Z'))
    expect(status.isOpen).toBe(false)
    expect(status.opening?.highTide.toISOString()).toBe('2026-10-30T00:41:00.000Z')
  })

  it('has no opening when there is no high tide left', () => {
    expect(bridgeStatus([], new Date('2026-10-29T09:00:00Z'))).toEqual({ isOpen: false, opening: undefined })
    expect(bridgeStatus(highTides, new Date('2026-10-30T02:00:00Z')).opening).toBeUndefined()
  })
})

describe('describeBridge', () => {
  it('says when the bridge will rise', () => {
    expect(describeAt('2026-10-29T09:00:00Z')).toEqual({
      title: 'Baissé, on peut traverser',
      detail: 'Il se lève de 11h16 à 14h01',
    })
  })

  it('says when an up bridge comes down', () => {
    expect(describeAt('2026-10-29T11:30:00Z')).toEqual({
      title: 'Levé, on ne peut pas traverser',
      detail: 'Il redescend à 14h01 · pleine mer à 13h16',
    })
  })

  it('keeps an opening late tonight on today', () => {
    expect(describeAt('2026-10-29T21:00:00Z').detail).toBe('Il se lève de 23h41 à 2h26')
  })

  it('says tomorrow when the next opening is after midnight', () => {
    expect(describeAt('2026-10-29T21:00:00Z', ['2026-10-30T03:00:00Z']).detail).toBe('Il se lève demain de 2h00 à 4h45')
  })

  it('gives no time when no opening is known', () => {
    expect(describeAt('2026-10-29T09:00:00Z', [])).toEqual({ title: 'Baissé, on peut traverser', detail: '' })
  })
})
