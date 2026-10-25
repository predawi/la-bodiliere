import { describe, expect, it } from 'vitest'
import { type OpenWeatherResponse, toWeather } from '~/server/utils/weather'

const response: OpenWeatherResponse = {
  name: 'Dieppe',
  weather: [{ description: 'couvert', icon: '04d' }],
  main: { temp: 11.4, feels_like: 9.6, humidity: 91 },
  wind: { speed: 5.3 },
  sys: { sunset: Date.UTC(2026, 9, 25, 16, 22) / 1000 },
}

describe('toWeather', () => {
  it('rounds the values and converts the wind to km/h', () => {
    expect(toWeather(response)).toMatchObject({
      city: 'Dieppe',
      temperature: 11,
      feelsLike: 10,
      humidity: 91,
      windKmh: 19,
    })
  })

  it('capitalizes the French description', () => {
    expect(toWeather(response).description).toBe('Couvert')
  })

  it('gives the sunset in Paris time', () => {
    expect(toWeather(response).sunset).toBe('17 h 22')
  })

  it('maps the OpenWeather icon to a simple one', () => {
    const withIcon = (icon: string) => toWeather({ ...response, weather: [{ description: 'x', icon }] }).icon
    expect(withIcon('01d')).toBe('sun')
    expect(withIcon('10n')).toBe('rain')
    expect(withIcon('13d')).toBe('snow')
    expect(withIcon('50d')).toBe('cloud')
  })

  it('still answers when OpenWeather sends no condition', () => {
    expect(toWeather({ ...response, weather: [] })).toMatchObject({ description: '', icon: 'cloud', temperature: 11 })
  })
})
