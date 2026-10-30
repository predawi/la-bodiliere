import { describe, expect, it } from 'vitest'
import { bridgeOpenings, bridgeStatus, describeBridge } from '~/utils/bridge'

// High tides at 13h16 and 1h41 (the next night), Paris time.
const highTides = ['2026-10-30T00:41:00Z', '2026-10-29T12:16:00Z']

const describeAt = (now: string, tides = highTides) => describeBridge(bridgeStatus(tides, new Date(now)), new Date(now))
const isOpenAt = (now: string) => bridgeStatus(highTides, new Date(now)).isOpen

describe('bridgeOpenings', () => {
  it('opens 2 h and 45 min before each high tide, 45 min after, and at 7h30 and 18h30, in order', () => {
    expect(bridgeOpenings(highTides, ['2026-10-29']).map(date => date.toISOString())).toEqual([
      '2026-10-29T06:30:00.000Z',
      '2026-10-29T10:16:00.000Z',
      '2026-10-29T11:31:00.000Z',
      '2026-10-29T13:01:00.000Z',
      '2026-10-29T17:30:00.000Z',
      '2026-10-29T22:41:00.000Z',
      '2026-10-29T23:56:00.000Z',
      '2026-10-30T01:26:00.000Z',
    ])
  })

  it('counts a fixed opening once when it falls during a tide opening', () => {
    expect(bridgeOpenings(['2026-10-29T07:17:00Z'], ['2026-10-29']).map(date => date.toISOString())).toEqual([
      '2026-10-29T05:17:00.000Z',
      '2026-10-29T06:30:00.000Z',
      '2026-10-29T08:02:00.000Z',
      '2026-10-29T17:30:00.000Z',
    ])
  })
})

describe('bridgeStatus', () => {
  it('is up for 5 min from each opening', () => {
    expect(isOpenAt('2026-10-29T10:15:59Z')).toBe(false)
    expect(isOpenAt('2026-10-29T10:16:00Z')).toBe(true)
    expect(isOpenAt('2026-10-29T10:20:59Z')).toBe(true)
    expect(isOpenAt('2026-10-29T10:21:00Z')).toBe(false)
  })

  it('is up at 45 min before high tide but down at high tide', () => {
    expect(isOpenAt('2026-10-29T11:33:00Z')).toBe(true)
    expect(isOpenAt('2026-10-29T12:16:00Z')).toBe(false)
  })

  it('is up at the fixed times, Paris time', () => {
    expect(isOpenAt('2026-10-29T06:32:00Z')).toBe(true)
    expect(isOpenAt('2026-10-29T17:32:00Z')).toBe(true)
  })

  it('keeps the fixed openings of today and tomorrow when no high tide is left', () => {
    expect(bridgeStatus([], new Date('2026-10-29T09:00:00Z')).openings.map(date => date.toISOString())).toEqual([
      '2026-10-29T17:30:00.000Z',
      '2026-10-30T06:30:00.000Z',
      '2026-10-30T17:30:00.000Z',
    ])
  })
})

describe('describeBridge', () => {
  it('gives the next two openings', () => {
    expect(describeAt('2026-10-29T09:00:00Z')).toEqual({
      title: 'Baissé, on peut traverser',
      detail: "S'il y a des bateaux, il se lèvera à 11h16 puis à 12h31",
    })
  })

  it('moves on once an opening is over', () => {
    expect(describeAt('2026-10-29T10:30:00Z').detail).toBe("S'il y a des bateaux, il se lèvera à 12h31 puis à 14h01")
  })

  it('says when a possibly raised bridge comes down', () => {
    expect(describeAt('2026-10-29T10:18:00Z')).toEqual({
      title: "Levé s'il y a des bateaux",
      detail: 'Il redescend vers 11h21',
    })
  })

  it('says tomorrow for an opening after midnight', () => {
    expect(describeAt('2026-10-29T21:00:00Z').detail).toBe("S'il y a des bateaux, il se lèvera à 23h41 puis demain à 0h56")
    expect(describeAt('2026-10-29T21:00:00Z', ['2026-10-30T03:00:00Z']).detail)
      .toBe("S'il y a des bateaux, il se lèvera demain à 2h00 puis à 3h15")
  })

  it('gives no time when no opening is known', () => {
    expect(describeBridge({ isOpen: false, openings: [] }, new Date('2026-10-29T09:00:00Z')))
      .toEqual({ title: 'Baissé, on peut traverser', detail: '' })
  })
})
