import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AvailabilityCalendar from '~/components/AvailabilityCalendar.vue'
import type { Booking } from '~/utils/bookings'

const louEtBenj: Booking = { id: 1, name: 'Lou & Benj', start_date: '2026-10-29', end_date: '2026-11-01' }

function mountCalendar() {
  return mountSuspended(AvailabilityCalendar, { props: { bookings: [louEtBenj], today: '2026-10-25' } })
}

describe('AvailabilityCalendar', () => {
  it('opens on the current month', async () => {
    const wrapper = await mountCalendar()
    expect(wrapper.text()).toContain('octobre 2026')
  })

  it('marks the booked nights and today', async () => {
    const wrapper = await mountCalendar()
    const day = (iso: string) => wrapper.find(`[data-day="${iso}"]`).classes()

    expect(day('2026-10-29')).toContain('day-booked')
    expect(day('2026-10-31')).toContain('day-booked')
    expect(day('2026-10-28')).not.toContain('day-booked')
    expect(day('2026-10-25')).toContain('day-today')
  })

  it('moves to the next month and cannot go back before the current one', async () => {
    const wrapper = await mountCalendar()
    const previous = wrapper.find('[aria-label="Mois précédent"]')

    expect(previous.attributes('disabled')).toBeDefined()

    await wrapper.find('[aria-label="Mois suivant"]').trigger('click')
    expect(wrapper.text()).toContain('novembre 2026')
    expect(wrapper.find('[data-day="2026-11-01"]').classes()).not.toContain('day-booked')
    expect(previous.attributes('disabled')).toBeUndefined()
  })
})
