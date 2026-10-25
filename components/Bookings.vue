<script setup lang="ts">
import type { Booking } from '~/utils/bookings'

const props = defineProps<{ bookings: Booking[], today: string }>()
const emit = defineEmits<{ delete: [booking: Booking] }>()

const pending = ref<Booking | null>(null)

function badgeFor(booking: Booking) {
  return isInProgress(booking, props.today) ? 'En ce moment' : formatDaysUntil(props.today, booking.start_date)
}

function confirmDelete() {
  if (pending.value) emit('delete', pending.value)
  pending.value = null
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <HeadingH2 title="Prochains séjours" />

    <p v-if="!bookings.length" class="card m-0 px-6 py-5 text-ink-muted">Aucun séjour prévu pour le moment.</p>

    <ul v-else class="m-0 flex list-none flex-col gap-3 p-0">
      <li v-for="(booking, index) in bookings" :key="booking.id">
        <StayCard
          :booking="booking"
          :highlighted="index === 0"
          :badge="index === 0 ? badgeFor(booking) : undefined"
          @delete="pending = booking"
        />
      </li>
    </ul>

    <ConfirmDialog
      v-if="pending"
      :title="`Supprimer le séjour de ${pending.name} ?`"
      confirm-label="Oui, supprimer"
      cancel-label="Non, garder"
      @confirm="confirmDelete"
      @cancel="pending = null"
    >
      {{ formatStayRange(pending.start_date, pending.end_date) }}. Ces dates redeviendront libres pour toute la famille.
    </ConfirmDialog>
  </section>
</template>
