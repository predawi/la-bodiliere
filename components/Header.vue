<script setup>

</script>

<template>
  <div>
    <header class="flex items-center justify-center">
      <nav class="container px-4 mx-auto py-4 flex flex-col md:flex-row justify-between items-center">
        <NuxtLink to="/" class="flex items-center logo-wrapper">
          <NuxtImg format="webp" src="/vache.png" width="112" height="85" class="w-16 md:w-28" />
          <h1 class="logo text-bodil-600 text-xl md:text-4xl">La Bodilière</h1>
        </NuxtLink>

        <ul class="flex gap-4 justify-center md:justify-start mt-10 md:mt-0">
          <li>
            <NuxtLink to="/signup" class="button">
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