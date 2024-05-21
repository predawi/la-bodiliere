<script setup>

</script>

<template>
  <div>
    <header class="flex items-center justify-center">
      <nav class="container mx-auto py-4 flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center logo-wrapper">
          <img src="public/vache.png" width="100" />
          <h1 class="logo text-bodil-600">La Bodilière</h1>
        </NuxtLink>

        <ul class="flex gap-4">
          <li>
            <NuxtLink to="/signup"
              class="text-white bg-bodil-700 hover:bg-bodil-800 focus:ring-4 focus:ring-bodil-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-bodil-600 dark:hover:bg-bodil-700 focus:outline-none dark:focus:ring-bodil-800 shadow-sm">
              Réserver un créneau</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<style lang="scss">
.logo {
  font-size: 38px;
  font-family: 'Dancing Script', serif;
}
</style>