<script setup lang="ts">
import type { Booking } from '~/utils/bookings'

const props = defineProps<{ bookings: Booking[] }>()

const stats = computed(() => bookingStats(props.bookings))
</script>

<template>
  <section class="flex flex-col gap-4">
    <HeadingH2 title="La maison en chiffres" />
    <div class="grid grid-cols-2 gap-3">
      <StatisticsItem :value="stats.count" label="séjours depuis le début" />
      <StatisticsItem :value="stats.totalNights" unit="nuits" label="passées à la maison" />
      <StatisticsItem :value="stats.longestStay" unit="nuits" label="le plus long séjour" />
      <StatisticsItem value="MIQF" label="meilleur bar de la ville" />
    </div>
  </section>
</template>
