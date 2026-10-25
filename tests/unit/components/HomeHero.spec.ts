import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HomeHero from '~/components/HomeHero.vue'
import type { Booking } from '~/utils/bookings'

const louEtBenj: Booking = { id: 1, name: 'Lou & Benj', start_date: '2026-10-29', end_date: '2026-11-01' }

describe('HomeHero', () => {
  it('shows the date and until when the house is free', async () => {
    const wrapper = await mountSuspended(HomeHero, { props: { bookings: [louEtBenj], today: '2026-10-25' } })

    expect(wrapper.text()).toContain('Dimanche 25 octobre')
    expect(wrapper.find('h1').text()).toBe("La maison est libre jusqu'au mercredi 28 octobre.")
    expect(wrapper.text()).toContain('Prochaine arrivée : Lou & Benj, jeudi 29 octobre.')
  })

  it('says who is at the house during a stay', async () => {
    const wrapper = await mountSuspended(HomeHero, { props: { bookings: [louEtBenj], today: '2026-10-30' } })

    expect(wrapper.find('h1').text()).toBe("La maison est occupée jusqu'au dimanche 1er novembre.")
    expect(wrapper.text()).toContain('En ce moment : Lou & Benj.')
  })
})
