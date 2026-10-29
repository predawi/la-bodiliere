import { describe, expect, it } from 'vitest'
import { highTides } from '~/server/utils/tides'

describe('highTides', () => {
  it('keeps only the high tides, as UTC instants', () => {
    expect(highTides({
      data: [
        { date: '2026-10-29', extrema: [{ type: 'PM', time: '00:58' }, { type: 'BM', time: '07:58' }, { type: 'PM', time: '13:16' }] },
        { date: '2026-10-30', extrema: [{ type: 'BM', time: '08:42' }] },
      ],
    })).toEqual(['2026-10-29T00:58:00Z', '2026-10-29T13:16:00Z'])
  })

  it('returns nothing for an empty answer', () => {
    expect(highTides({ data: [] })).toEqual([])
  })
})
