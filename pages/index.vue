<script setup>

</script>

<template>
  <div class="pt-8 h-screen">
    <div class="container px-4 mx-auto">
      <div class="md:flex md:flex-row">
        <div class="flex-1">
          <Bookings />
          <Statistics />
        </div>

        <div>
          <Weather />
        </div>
      </div>
    </div>
  </div>
</template>
