<script setup>

</script>

<template>
  <div class="pt-14 pb-14 md:pb-0">
    <div class="container px-4 mx-auto">
      <div class="md:grid md:grid-cols-12 md:gap-6">
        <div class="md:col-span-9">
          <Bookings />
          <Statistics />
        </div>

        <div class="md:col-span-3">
          <Weather />
        </div>
      </div>
    </div>
  </div>
</template>
