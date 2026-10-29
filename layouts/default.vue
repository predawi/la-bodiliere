<template>
  <div class="mx-auto max-w-content px-4 pb-16 md:px-6">
    <Header />
    <slot />
    <footer class="mt-12 border-t border-galet pt-4 text-[15px] text-ink-muted md:mt-16">
      <p class="m-0">
        Horaires des marées fournis par
        <a href="https://api-maree.fr/" class="py-4 text-ink underline underline-offset-2">api-maree.fr</a>,
        d'après les données Ifremer / PREVIMER (licence CC BY).
      </p>
    </footer>
  </div>
</template>
