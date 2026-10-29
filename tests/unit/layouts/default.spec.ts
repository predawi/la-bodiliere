import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DefaultLayout from '~/layouts/default.vue'

describe('default layout', () => {
  it('credits api-maree.fr for the tide times', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    const link = wrapper.find('footer a')

    expect(wrapper.find('footer').text()).toContain('Ifremer / PREVIMER (licence CC BY)')
    expect(link.text()).toBe('api-maree.fr')
    expect(link.attributes('href')).toBe('https://api-maree.fr/')
  })
})
