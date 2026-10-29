export interface TideExtremaResponse {
  data: {
    date: string
    extrema: { type: 'PM' | 'BM', time: string }[]
  }[]
}

// Requested with tz=UTC, so each "date" + "time" is a UTC instant.
export function highTides(raw: TideExtremaResponse): string[] {
  return (raw.data ?? []).flatMap(day => day.extrema
    .filter(extremum => extremum.type === 'PM')
    .map(extremum => `${day.date}T${extremum.time}:00Z`))
}
