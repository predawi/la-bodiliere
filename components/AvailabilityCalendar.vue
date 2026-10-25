<script setup lang="ts">
import type { Booking } from '~/utils/bookings'

const props = defineProps<{ bookings: Booking[], today: string }>()

const WEEKDAYS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.']

const offset = ref(0)

const month = computed(() => {
  const date = parseDay(props.today)
  date.setUTCDate(1)
  date.setUTCMonth(date.getUTCMonth() + offset.value)
  return { year: date.getUTCFullYear(), index: date.getUTCMonth() }
})

const grid = computed(() => monthGrid(month.value.year, month.value.index))

function dayClass(day: string) {
  if (day < props.today) return 'text-ink-muted'
  return [
    isNightBooked(props.bookings, day) ? 'day-booked font-medium' : 'bg-surface-sunk',
    day === props.today && 'day-today font-semibold',
  ]
}
</script>

<template>
  <section class="card flex flex-col gap-4 px-4 py-5 md:px-6">
    <h2 class="m-0 text-[28px] leading-tight md:text-[30px]">Quand la maison est-elle libre ?</h2>

    <div class="flex max-w-[560px] flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        <button
          type="button"
          class="flex size-12 items-center justify-center rounded-full border border-galet bg-surface disabled:opacity-40"
          aria-label="Mois précédent"
          :disabled="offset === 0"
          @click="offset--"
        >
          <AppIcon name="chevron-left" :size="22" />
        </button>
        <span class="font-display text-[26px] capitalize" aria-live="polite">{{ formatMonth(month.year, month.index) }}</span>
        <button
          type="button"
          class="flex size-12 items-center justify-center rounded-full border border-galet bg-surface"
          aria-label="Mois suivant"
          @click="offset++"
        >
          <AppIcon name="chevron-right" :size="22" />
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <span v-for="weekday in WEEKDAYS" :key="weekday" class="py-1 text-center text-sm font-medium text-ink-muted">{{ weekday }}</span>
        <span v-for="blank in grid.leadingBlanks" :key="`blank-${blank}`" />
        <span
          v-for="day in grid.days"
          :key="day"
          :data-day="day"
          class="flex aspect-square items-center justify-center rounded-field text-[17px]"
          :class="dayClass(day)"
        >
          {{ Number(day.slice(8)) }}
        </span>
      </div>

      <div class="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink-muted">
        <span class="inline-flex items-center gap-2"><i class="day-booked size-[18px] rounded-[5px]" />Maison prise</span>
        <span class="inline-flex items-center gap-2"><i class="day-today size-[18px] rounded-[5px] bg-surface-sunk" />Aujourd'hui</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.day-booked {
  background-color: var(--sea-tint);
  background-image: repeating-linear-gradient(135deg, transparent 0 6px, color-mix(in srgb, var(--sea) 18%, transparent) 6px 7.5px);
  box-shadow: inset 0 0 0 1.5px var(--sea);
}

.day-today {
  box-shadow: inset 0 0 0 2.5px var(--soleil);
}
</style>
