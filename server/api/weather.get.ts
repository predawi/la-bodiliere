const DIEPPE = { lat: 49.92, lon: 1.07 }

export default defineCachedEventHandler(async () => {
  const { openweatherApiKey } = useRuntimeConfig()
  if (!openweatherApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Weather is not configured' })
  }

  const raw = await $fetch<OpenWeatherResponse>('https://api.openweathermap.org/data/2.5/weather', {
    query: { ...DIEPPE, appid: openweatherApiKey, units: 'metric', lang: 'fr' },
  })
  return toWeather(raw)
}, { maxAge: 600, name: 'weather' })
