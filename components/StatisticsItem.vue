<template>
  <div class="flex flex-col items-center p-6 border rounded-xl bg-white text-center">
    <span class="text-bodil-800 font-bold">{{ stat }} {{ unit }}</span>
    <span class="mt-1">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'statistics-item',
  props: ['text', 'stat', 'unit'],
}
</script>
