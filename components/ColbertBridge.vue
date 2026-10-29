<script setup lang="ts">
const { data } = await useFetch('/api/tides')

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => { now.value = new Date() }, 60_000)
})
onUnmounted(() => clearInterval(timer))

const status = computed(() => data.value?.highTides.length ? bridgeStatus(data.value.highTides, now.value) : undefined)
const text = computed(() => status.value && describeBridge(status.value, now.value))
const isOpen = computed(() => status.value?.isOpen ?? false)

const panelX = (i: number) => 40 + 24 * i
const topY = (i: number) => Math.round(780 - 800 * (i / 10) * (1 - i / 10)) / 10
const truss = [
  'M40 78Q160 38 280 78M280 78V90',
  ...Array.from({ length: 10 }, (_, i) =>
    `M${panelX(i)} ${topY(i)}V90M${panelX(i)} ${topY(i)}L${panelX(i + 1)} 90M${panelX(i)} 90L${panelX(i + 1)} ${topY(i + 1)}`),
].join('')
</script>

<template>
  <figure class="m-0 flex flex-col gap-1">
    <svg viewBox="0 0 320 130" class="w-full" aria-hidden="true">
      <circle cx="70" cy="26" r="13" class="fill-soleil" />
      <g class="transition-opacity duration-500 motion-reduce:transition-none" :class="isOpen ? 'opacity-100 delay-300' : 'opacity-0'">
        <path d="M188 104h34l-5 7h-24z" class="fill-on-abysse" />
        <path d="M204 102V58l14 40h-14" class="fill-ecume" />
        <path d="M204 102V58" class="stroke-on-abysse" stroke-width="2" />
      </g>
      <rect x="0" y="92" width="44" height="38" class="fill-galet-strong" />
      <rect x="276" y="92" width="44" height="38" class="fill-galet-strong" />
      <path d="M44 112q8-5 16 0t16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0" fill="none" class="stroke-ecume" stroke-width="2.5" stroke-linecap="round" />
      <path d="M60 122q8-4 16 0t16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0" fill="none" class="stroke-ecume" stroke-width="2" stroke-linecap="round" opacity=".55" />
      <g class="origin-[40px_90px] transition-transform duration-1000 motion-reduce:transition-none" :class="{ '-rotate-[18deg]': isOpen }">
        <path :d="truss" fill="none" class="stroke-on-abysse" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" />
        <rect x="38" y="88" width="244" height="5" rx="1.5" class="fill-on-abysse" />
      </g>
      <circle cx="40" cy="91" r="4" class="fill-soleil" />
    </svg>

    <figcaption class="flex flex-col">
      <span class="text-[15px] text-abysse-muted">Pont Colbert</span>
      <template v-if="text">
        <span class="font-display text-[26px] leading-tight">{{ text.title }}</span>
        <span v-if="text.detail" class="text-abysse-muted">{{ text.detail }}</span>
      </template>
      <span v-else class="text-abysse-muted">Les horaires du pont ne sont pas disponibles pour le moment.</span>
    </figcaption>
  </figure>
</template>
