import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Bookings from '~/components/Bookings.vue'
import type { Booking } from '~/utils/bookings'

const louEtBenj: Booking = { id: 1, name: 'Lou & Benj', start_date: '2026-10-29', end_date: '2026-11-01' }
const martin: Booking = { id: 2, name: 'Les Martin', start_date: '2026-11-14', end_date: '2026-11-15' }

function mountBookings(bookings: Booking[], today = '2026-10-25') {
  return mountSuspended(Bookings, { props: { bookings, today }, attachTo: document.body })
}

describe('Bookings', () => {
  it('lists stays with their dates in words and their nights', async () => {
    const wrapper = await mountBookings([louEtBenj, martin])

    expect(wrapper.text()).toContain('Du jeudi 29 octobre au dimanche 1er novembre')
    expect(wrapper.text()).toContain('3 nuits')
    expect(wrapper.text()).toContain('Du samedi 14 au dimanche 15 novembre')
    expect(wrapper.text()).toContain('1 nuit')
  })

  it('tells in how many days the next stay starts', async () => {
    const wrapper = await mountBookings([louEtBenj, martin])
    expect(wrapper.text()).toContain('Dans 4 jours')
  })

  it('marks a stay that has already started', async () => {
    const wrapper = await mountBookings([louEtBenj], '2026-10-30')
    expect(wrapper.text()).toContain('En ce moment')
  })

  it('shows an empty state when nothing is booked', async () => {
    const wrapper = await mountBookings([])
    expect(wrapper.text()).toContain('Aucun séjour prévu pour le moment.')
  })

  it('asks for confirmation before deleting a stay', async () => {
    const wrapper = await mountBookings([louEtBenj, martin])

    await wrapper.findAll('button').find(button => button.text() === 'Supprimer')!.trigger('click')
    expect(document.body.textContent).toContain('Supprimer le séjour de Lou & Benj ?')
    expect(wrapper.emitted('delete')).toBeUndefined()

    const confirm = [...document.body.querySelectorAll('button')].find(button => button.textContent?.includes('Oui, supprimer'))!
    confirm.click()
    await nextTick()

    expect(wrapper.emitted('delete')).toEqual([[louEtBenj]])
    expect(document.body.textContent).not.toContain('Supprimer le séjour de')
    wrapper.unmount()
  })

  it('keeps the stay when the deletion is cancelled', async () => {
    const wrapper = await mountBookings([louEtBenj])

    await wrapper.find('button').trigger('click')
    const cancel = [...document.body.querySelectorAll('button')].find(button => button.textContent?.includes('Non, garder'))!
    cancel.click()
    await nextTick()

    expect(wrapper.emitted('delete')).toBeUndefined()
    expect(document.body.textContent).not.toContain('Supprimer le séjour de')
    wrapper.unmount()
  })
})
