<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <h2 class="m-0 text-[28px] leading-tight md:text-[30px]">{{ title }}</h2>
    <span class="wave w-20" aria-hidden="true" />
  </div>
</template>
