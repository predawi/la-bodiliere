<template>
  <div class='flex flex-col items-center p-6 border rounded-xl bg-white text-center statistic-item'
    :class="{ 'cls-loading': clsloading }">
    <span class=" text-bodil-800 font-semibold text-xl">{{ stat }} {{ unit }}</span>
    <span class="mt-2">{{ text }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'statistics-item',
  props: ['text', 'stat', 'unit'],
  data() {
    return {
      clsloading: true
    }
  },
  mounted: function () {
    setTimeout(() => {
      this.clsloading = false
    }, 500);
  }
}
</script>
