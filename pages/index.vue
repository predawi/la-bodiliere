<script setup lang="ts">
import type { Booking } from '~/utils/bookings'

const today = useToday()
const { bookings, error, deleteBooking } = useBookings()

const upcoming = computed(() => upcomingBookings(bookings.value, today.value))
const deleteFailed = ref(false)

async function onDelete(booking: Booking) {
  deleteFailed.value = false
  try {
    await deleteBooking(booking.id)
  } catch {
    deleteFailed.value = true
  }
}
</script>

<template>
  <div class="flex flex-col gap-8 md:gap-12">
    <HomeHero :bookings="bookings" :today="today" />

    <p v-if="error" role="alert" class="m-0 flex gap-3 rounded-field bg-bouee-tint p-4 text-bouee">
      <AppIcon name="alert" :size="24" />
      Impossible de charger les séjours. Recharge la page dans un instant.
    </p>

    <div class="flex flex-wrap items-start gap-x-10 gap-y-8 md:gap-y-12">
      <div class="flex min-w-0 flex-[999_1_560px] flex-col gap-8 md:gap-12">
        <div class="flex flex-col gap-3">
          <Bookings :bookings="upcoming" :today="today" @delete="onDelete" />
          <p v-if="deleteFailed" role="alert" class="m-0 flex gap-3 rounded-field bg-bouee-tint p-4 text-bouee">
            <AppIcon name="alert" :size="24" />
            Le séjour n'a pas pu être supprimé. Réessaie dans un instant.
          </p>
        </div>
        <AvailabilityCalendar :bookings="bookings" :today="today" />
      </div>

      <aside class="flex min-w-0 flex-[1_1_320px] flex-col gap-8 md:gap-12">
        <Weather />
        <Statistics :bookings="bookings" />
      </aside>
    </div>
  </div>
</template>
