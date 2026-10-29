import { bookingIcs, stayFromQuery } from '~/utils/calendar'

export default defineEventHandler((event) => {
  const stay = stayFromQuery(getQuery(event))
  if (!stay) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid stay' })
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/calendar; charset=utf-8',
    'Content-Disposition': 'attachment; filename="sejour-bodiliere.ics"',
  })
  return bookingIcs(stay, getRequestURL(event).origin)
})
