<script setup lang="ts">
import type { Booking } from '~/utils/bookings'

const props = defineProps<{ bookings: Booking[], today: string }>()

const status = computed(() => describeHouseStatus(houseStatus(props.bookings, props.today), props.today))
</script>

<template>
  <section class="relative flex flex-col gap-3 overflow-hidden rounded-card bg-abysse px-5 py-6 text-on-abysse md:px-12 md:py-10">
    <span class="absolute right-5 top-5 size-10 rounded-full bg-soleil md:right-14 md:top-11 md:size-14" aria-hidden="true" />
    <span class="self-start rounded-full bg-soleil px-3 py-1 text-[15px] font-medium text-on-soleil">
      {{ capitalize(formatLongDate(today)) }}
    </span>
    <h1 class="m-0 max-w-[22ch] pr-12 text-[34px] md:pr-0 leading-[1.1] md:text-[52px]">{{ status.title }}</h1>
    <p class="m-0 text-[19px] text-abysse-muted md:text-xl">{{ status.detail }}</p>
    <span class="wave mt-4 bg-ecume" aria-hidden="true" />
  </section>
</template>
