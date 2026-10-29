import { addDays, parisDay } from '~/utils/dates'

export default defineCachedEventHandler(async () => {
  const { apiMareeKey } = useRuntimeConfig()
  if (!apiMareeKey) {
    throw createError({ statusCode: 503, statusMessage: 'Tides are not configured' })
  }

  // From yesterday to tomorrow: a high tide just past midnight opens the bridge the evening before.
  const today = parisDay(new Date())
  const raw = await $fetch<TideExtremaResponse>('https://api-maree.fr/tide-extrema', {
    query: { site: 'dieppe', from: addDays(today, -1), to: addDays(today, 1), tz: 'UTC' },
    headers: { Authorization: `Bearer ${apiMareeKey}` },
    timeout: 5000,
  })
  return { highTides: highTides(raw) }
}, { maxAge: 3600, name: 'tides' })
