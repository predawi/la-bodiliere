import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import ColbertBridge from '~/components/ColbertBridge.vue'

let highTides: string[] = []
registerEndpoint('/api/tides', () => ({ highTides }))

describe('ColbertBridge', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    highTides = ['2026-10-29T12:16:00Z']
    clearNuxtData()
  })
  afterEach(() => vi.useRealTimers())

  it('shows a lowered bridge and when it rises', async () => {
    vi.setSystemTime(new Date('2026-10-29T09:00:00Z'))
    const wrapper = await mountSuspended(ColbertBridge)

    expect(wrapper.text()).toContain('Baissé, on peut traverser')
    expect(wrapper.text()).toContain("Il s'ouvrira une fois à 11h16 et une fois à 14h01")
  })

  it('shows a raised bridge during the opening', async () => {
    vi.setSystemTime(new Date('2026-10-29T10:18:00Z'))
    const wrapper = await mountSuspended(ColbertBridge)

    expect(wrapper.text()).toContain('Levé, on ne peut pas traverser')
    expect(wrapper.find('.-rotate-\\[18deg\\]').exists()).toBe(true)
  })

  it('says when the tide times are missing', async () => {
    highTides = []
    const wrapper = await mountSuspended(ColbertBridge)

    expect(wrapper.text()).toContain('Les horaires du pont ne sont pas disponibles pour le moment.')
  })
})
