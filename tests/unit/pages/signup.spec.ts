import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import SignupPage from '~/pages/signup.vue'

const { addBooking, sendMail } = vi.hoisted(() => ({ addBooking: vi.fn(), sendMail: vi.fn() }))

mockNuxtImport('useBookings', () => () => ({
  bookings: ref([{ id: 1, name: 'Lou & Benj', start_date: '2026-10-29', end_date: '2026-11-01' }]),
  addBooking,
}))
mockNuxtImport('useMail', () => () => ({ send: sendMail }))
mockNuxtImport('useToday', () => () => ref('2026-10-25'))

async function fillForm(name: string, start: string, end: string) {
  const wrapper = await mountSuspended(SignupPage)
  await wrapper.find('#name').setValue(name)
  await wrapper.find('#start_date').setValue(start)
  await wrapper.find('#end_date').setValue(end)
  return wrapper
}

function submitButton(wrapper: Awaited<ReturnType<typeof fillForm>>) {
  return wrapper.find('button[type="submit"]')
}

describe('signup page', () => {
  beforeEach(() => {
    addBooking.mockReset().mockResolvedValue(undefined)
    sendMail.mockReset().mockResolvedValue(undefined)
  })

  it('confirms that the house is free and counts the nights', async () => {
    const wrapper = await fillForm('Mamie & Papi', '2026-11-07', '2026-11-10')

    expect(wrapper.text()).toContain('La maison est libre.')
    expect(wrapper.text()).toContain('Du samedi 7 au mardi 10 novembre, 3 nuits.')
    expect(submitButton(wrapper).attributes('disabled')).toBeUndefined()
  })

  it('blocks dates that overlap another stay', async () => {
    const wrapper = await fillForm('Mamie & Papi', '2026-10-30', '2026-11-02')

    expect(wrapper.text()).toContain('La maison est déjà prise : Lou & Benj')
    expect(submitButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('asks for a departure after the arrival', async () => {
    const wrapper = await mountSuspended(SignupPage)
    await wrapper.find('#name').setValue('Mamie & Papi')
    await wrapper.find('#end_date').setValue('2026-11-07')
    await wrapper.find('#start_date').setValue('2026-11-10')

    expect(wrapper.text()).toContain("Choisis une date de départ après la date d'arrivée.")
    expect(wrapper.find('#end_date').attributes('aria-invalid')).toBe('true')
    expect(submitButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('needs a name', async () => {
    const wrapper = await fillForm('  ', '2026-11-07', '2026-11-10')
    expect(submitButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('saves the stay, notifies the family and shows the confirmation', async () => {
    const wrapper = await fillForm(' Mamie & Papi ', '2026-11-07', '2026-11-10')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(addBooking).toHaveBeenCalledWith({ name: 'Mamie & Papi', start_date: '2026-11-07', end_date: '2026-11-10' })
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'Nouveau séjour : Mamie & Papi',
      text: expect.stringContaining('Arrivée : Samedi 7 novembre 2026'),
      html: expect.stringContaining("C'est réservé pour Mamie &amp; Papi !"),
    }))
    expect(wrapper.text()).toContain("C'est réservé !")
  })

  it('offers to add the saved stay to a personal calendar', async () => {
    const wrapper = await fillForm('Mamie & Papi', '2026-11-07', '2026-11-10')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const google = wrapper.find('a[href^="https://calendar.google.com"]')
    const ics = wrapper.find('a[download="sejour-bodiliere.ics"]')
    expect(wrapper.text()).toContain('Ajouter à mon agenda')
    expect(google.text()).toBe('Google Agenda')
    expect(google.attributes('href')).toContain('dates=20261107%2F20261111')
    expect(decodeURIComponent(ics.attributes('href')!)).toContain('DTSTART;VALUE=DATE:20261107')
  })

  it('keeps the form and explains when saving fails', async () => {
    addBooking.mockRejectedValue(new Error('network'))
    const wrapper = await fillForm('Mamie & Papi', '2026-11-07', '2026-11-10')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain("La réservation n'a pas pu être enregistrée.")
    expect(wrapper.find('form').exists()).toBe(true)
    expect(sendMail).not.toHaveBeenCalled()
  })
})
