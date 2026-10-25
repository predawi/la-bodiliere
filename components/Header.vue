<script setup lang="ts">
const route = useRoute();
const onBookingPage = computed(() => route.path === "/signup");
</script>

<template>
  <header
    class="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between md:py-6"
  >
    <NuxtLink
      to="/"
      class="flex min-h-12 items-center gap-3 self-start text-sea-strong no-underline"
    >
      <NuxtImg
        format="webp"
        src="/vache.png"
        width="144"
        height="110"
        alt=""
        class="w-14 md:w-[110px]"
      />
      <span
        class="font-display text-[32px] leading-none tracking-tight md:text-[40px]"
        >La Bodilière</span
      >
    </NuxtLink>

    <NuxtLink
      v-if="onBookingPage"
      to="/"
      class="button button-secondary self-start sm:self-auto"
    >
      <AppIcon name="chevron-left" />
      Retour à l'accueil
    </NuxtLink>
    <NuxtLink
      v-else
      to="/signup"
      class="button button-primary button-md w-full sm:w-auto"
    >
      <AppIcon name="calendar" />
      Réserver la maison
    </NuxtLink>
  </header>
</template>
