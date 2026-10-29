import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import StayCard from '~/components/StayCard.vue'

const booking = { id: 1, name: 'Ben Test Email', start_date: '2026-12-24', end_date: '2027-01-01' }

describe('StayCard', () => {
  it('shows who comes, the dates and the nights', async () => {
    const wrapper = await mountSuspended(StayCard, { props: { booking } })

    expect(wrapper.text()).toContain('Ben Test Email')
    expect(wrapper.text()).toContain('Du jeudi 24 décembre 2026 au vendredi 1er janvier 2027')
    expect(wrapper.text()).toContain('8 nuits')
  })

  it('emits delete from its button', async () => {
    const wrapper = await mountSuspended(StayCard, { props: { booking } })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('delete')).toHaveLength(1)
  })

  it('has no delete button when read-only', async () => {
    const wrapper = await mountSuspended(StayCard, { props: { booking, readonly: true } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  // Without the button, the dates must stay in the first column instead of taking the empty second one.
  it('keeps the dates under the name in the wide layout', async () => {
    const wrapper = await mountSuspended(StayCard, { props: { booking, readonly: true } })
    expect(wrapper.find('p').classes()).toContain('sm:col-start-1')
  })
})
