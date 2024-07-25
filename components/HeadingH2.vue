<template>
  <h2 class="mb-6 md:flex items-center text-xl md:text-2xl">
    <SvgIcon :name=icon class="mr-2 text-bodil-600" />
    {{ title }}
  </h2>
</template>

<script>
export default {
  props: ['title', 'icon'],
}
</script>