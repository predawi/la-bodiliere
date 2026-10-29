import { formatTime } from '~/utils/dates'

export type WeatherIcon = 'sun' | 'cloud' | 'rain' | 'snow'

export interface Weather {
  city: string
  description: string
  icon: WeatherIcon
  temperature: number
  feelsLike: number
  humidity: number
  windKmh: number
  sunset: string
}

export interface OpenWeatherResponse {
  name: string
  weather: { description: string, icon: string }[]
  main: { temp: number, feels_like: number, humidity: number }
  wind: { speed: number }
  sys: { sunset: number }
}

const ICONS: Record<string, WeatherIcon> = {
  '01': 'sun',
  '09': 'rain',
  '10': 'rain',
  '11': 'rain',
  '13': 'snow',
}

export function toWeather(raw: OpenWeatherResponse): Weather {
  const condition = raw.weather?.[0] ?? { description: '', icon: '' }
  return {
    city: raw.name,
    description: condition.description.charAt(0).toUpperCase() + condition.description.slice(1),
    icon: ICONS[condition.icon.slice(0, 2)] ?? 'cloud',
    temperature: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    windKmh: Math.round(raw.wind.speed * 3.6),
    sunset: formatTime(new Date(raw.sys.sunset * 1000)),
  }
}
