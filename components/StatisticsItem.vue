<script setup lang="ts">
defineProps<{ value: string | number, label: string, unit?: string }>()
</script>

<template>
  <div class="card flex flex-col gap-1 px-4 py-4 md:px-6 md:py-5">
    <span class="font-display text-[44px] leading-none text-sea-strong">
      {{ value }}<small v-if="unit" class="ml-1.5 text-[22px]">{{ unit }}</small>
    </span>
    <span class="text-base text-ink-muted">{{ label }}</span>
  </div>
</template>
