<script setup lang="ts">
import type { Booking } from '~/utils/bookings'

defineProps<{ booking: Booking, highlighted?: boolean, badge?: string, readonly?: boolean }>()
defineEmits<{ delete: [] }>()
</script>

<template>
  <article
    class="grid grid-cols-1 items-center gap-x-4 gap-y-1 rounded-card px-5 py-4 sm:grid-cols-[1fr_auto] sm:px-6 sm:py-5"
    :class="highlighted ? 'bg-sea-tint' : 'card'"
  >
    <div class="flex min-w-0 flex-wrap items-center gap-3">
      <span class="font-display text-[30px] leading-tight tracking-tight">{{ booking.name }}</span>
      <span v-if="badge" class="whitespace-nowrap rounded-full border border-galet bg-surface px-3 py-1 text-[15px] font-medium">
        {{ badge }}
      </span>
    </div>
    <p class="m-0 min-w-0 text-[19px] leading-snug">
      {{ formatStayRange(booking.start_date, booking.end_date) }}
      <span class="text-base text-ink-muted">· {{ formatNights(countNights(booking.start_date, booking.end_date)) }}</span>
    </p>
    <button
      v-if="!readonly"
      type="button"
      class="button button-quiet -ml-3.5 justify-self-start sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:ml-0"
      @click="$emit('delete')"
    >
      <AppIcon name="trash" />
      Supprimer
    </button>
  </article>
</template>
