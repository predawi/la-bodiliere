import { describe, expect, it } from 'vitest'
import { bridgeOpenings, bridgeStatus, describeBridge } from '~/utils/bridge'

// High tides at 13h16 and 1h41 (the next night), Paris time.
const highTides = ['2026-10-30T00:41:00Z', '2026-10-29T12:16:00Z']

const describeAt = (now: string, tides = highTides) => describeBridge(bridgeStatus(tides, new Date(now)), new Date(now))

describe('bridgeOpenings', () => {
  it('opens 2 h before and 45 min after each high tide, in order', () => {
    expect(bridgeOpenings(highTides).map(date => date.toISOString())).toEqual([
      '2026-10-29T10:16:00.000Z',
      '2026-10-29T13:01:00.000Z',
      '2026-10-29T22:41:00.000Z',
      '2026-10-30T01:26:00.000Z',
    ])
  })
})

describe('bridgeStatus', () => {
  it('is up for 5 min from each opening', () => {
    expect(bridgeStatus(highTides, new Date('2026-10-29T10:15:59Z')).isOpen).toBe(false)
    expect(bridgeStatus(highTides, new Date('2026-10-29T10:16:00Z')).isOpen).toBe(true)
    expect(bridgeStatus(highTides, new Date('2026-10-29T10:20:59Z')).isOpen).toBe(true)
    expect(bridgeStatus(highTides, new Date('2026-10-29T10:21:00Z')).isOpen).toBe(false)
  })

  it('is down between the two openings of a high tide', () => {
    expect(bridgeStatus(highTides, new Date('2026-10-29T12:16:00Z')).isOpen).toBe(false)
    expect(bridgeStatus(highTides, new Date('2026-10-29T13:02:00Z')).isOpen).toBe(true)
  })

  it('has no opening when there is no high tide left', () => {
    expect(bridgeStatus([], new Date('2026-10-29T09:00:00Z'))).toEqual({ isOpen: false, openings: [] })
    expect(bridgeStatus(highTides, new Date('2026-10-30T02:00:00Z')).openings).toEqual([])
  })
})

describe('describeBridge', () => {
  it('gives the next two openings', () => {
    expect(describeAt('2026-10-29T09:00:00Z')).toEqual({
      title: 'Baissé, on peut traverser',
      detail: "Il s'ouvrira une fois à 11h16 et une fois à 14h01",
    })
  })

  it('moves on once an opening is over', () => {
    expect(describeAt('2026-10-29T11:30:00Z').detail).toBe("Il s'ouvrira une fois à 14h01 et une fois à 23h41")
  })

  it('says when an up bridge comes down', () => {
    expect(describeAt('2026-10-29T10:18:00Z')).toEqual({
      title: 'Levé, on ne peut pas traverser',
      detail: 'Il redescend vers 11h21',
    })
  })

  it('says tomorrow for an opening after midnight', () => {
    expect(describeAt('2026-10-29T21:00:00Z').detail).toBe("Il s'ouvrira une fois à 23h41 et une fois demain à 2h26")
    expect(describeAt('2026-10-29T21:00:00Z', ['2026-10-30T03:00:00Z']).detail)
      .toBe("Il s'ouvrira une fois demain à 2h00 et une fois à 4h45")
  })

  it('gives the last known opening alone', () => {
    expect(describeAt('2026-10-30T00:00:00Z').detail).toBe("Il s'ouvrira à 2h26")
  })

  it('gives no time when no opening is known', () => {
    expect(describeAt('2026-10-29T09:00:00Z', [])).toEqual({ title: 'Baissé, on peut traverser', detail: '' })
  })
})
