import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import Bookings from '~/components/Bookings.vue'

const { upcomingBookings } = vi.hoisted(() => ({ upcomingBookings: vi.fn() }))

mockNuxtImport('useSupabaseClient', () => () => ({
  from: () => ({
    select: () => ({
      order: () => ({ gt: upcomingBookings }),
    }),
  }),
}))

describe('Bookings', () => {
  beforeEach(() => {
    upcomingBookings.mockReset()
  })

  it('lists upcoming bookings with their dates', async () => {
    upcomingBookings.mockResolvedValue({
      data: [{ id: 1, name: 'Lou & Benj', start_date: '2026-10-29', end_date: '2026-11-01' }],
    })

    const wrapper = await mountSuspended(Bookings)
    await flushPromises()

    expect(upcomingBookings).toHaveBeenCalledWith('end_date', expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/))
    expect(wrapper.text()).toContain('Lou & Benj')
    expect(wrapper.text()).toContain('29/10/2026')
    expect(wrapper.text()).toContain('01/11/2026')
    expect(wrapper.text()).not.toContain('Aucune réservation')
  })

  it('shows an empty state when nothing is booked', async () => {
    upcomingBookings.mockResolvedValue({ data: [] })

    const wrapper = await mountSuspended(Bookings)
    await flushPromises()

    expect(wrapper.text()).toContain('Aucune réservation pour le moment')
  })
})
