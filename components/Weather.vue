<script setup lang="ts">
const { data: weather } = useFetch('/api/weather')
</script>

<template>
  <section class="flex flex-col gap-4">
    <HeadingH2 title="La météo à Dieppe" />

    <div v-if="weather" class="card grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 p-5 md:p-6">
      <AppIcon :name="weather.icon" :size="56" class="text-sea" />
      <div>
        <div class="font-display text-[56px] leading-none">{{ weather.temperature }}°</div>
        <div class="text-ink-muted">{{ weather.description }}</div>
      </div>
      <dl class="col-span-2 m-0 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-galet pt-4">
        <div class="flex flex-col"><dt class="text-[15px] text-ink-muted">Ressenti</dt><dd class="m-0 font-medium">{{ weather.feelsLike }}°</dd></div>
        <div class="flex flex-col"><dt class="text-[15px] text-ink-muted">Humidité</dt><dd class="m-0 font-medium">{{ weather.humidity }} %</dd></div>
        <div class="flex flex-col"><dt class="text-[15px] text-ink-muted">Vent</dt><dd class="m-0 font-medium">{{ weather.windKmh }} km/h</dd></div>
        <div class="flex flex-col"><dt class="text-[15px] text-ink-muted">Coucher du soleil</dt><dd class="m-0 font-medium">{{ weather.sunset }}</dd></div>
      </dl>
    </div>

    <p v-else class="card m-0 px-6 py-5 text-ink-muted">La météo n'est pas disponible pour le moment.</p>
  </section>
</template>
