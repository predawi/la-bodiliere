import type { Booking, NewBooking } from '~/utils/bookings'

export function useBookings() {
  const supabase = useSupabaseClient()

  const { data: bookings, error, refresh } = useAsyncData('bookings', async () => {
    const { data, error } = await supabase.from('bookings').select().order('start_date', { ascending: true })
    if (error) throw error
    return data as Booking[]
  }, { default: () => [] })

  async function addBooking(booking: NewBooking) {
    const { error } = await supabase.from('bookings').insert(booking)
    if (error) throw error
    await refresh()
  }

  async function deleteBooking(id: number) {
    const { error } = await supabase.from('bookings').delete().eq('id', id)
    if (error) throw error
    await refresh()
  }

  return { bookings, error, addBooking, deleteBooking }
}
