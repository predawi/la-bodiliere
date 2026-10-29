<script setup lang="ts">
import type { Booking } from '~/utils/bookings'

const props = defineProps<{ bookings: Booking[], today: string }>()

const status = computed(() => describeHouseStatus(houseStatus(props.bookings, props.today), props.today))
</script>

<template>
  <section class="grid gap-x-10 gap-y-6 overflow-hidden rounded-card bg-abysse px-5 py-6 text-on-abysse md:grid-cols-[minmax(0,1fr)_300px] md:items-center md:px-12 md:py-10">
    <div class="flex flex-col gap-3">
      <span class="self-start rounded-full bg-soleil px-3 py-1 text-[15px] font-medium text-on-soleil">
        {{ capitalize(formatLongDate(today)) }}
      </span>
      <h1 class="m-0 max-w-[22ch] text-[34px] leading-[1.1] md:text-[52px]">{{ status.title }}</h1>
      <p class="m-0 text-[19px] text-abysse-muted md:text-xl">{{ status.detail }}</p>
    </div>
    <ColbertBridge />
    <span class="wave bg-ecume md:col-span-2" aria-hidden="true" />
  </section>
</template>
