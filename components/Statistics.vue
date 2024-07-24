<script setup lang="ts">
const supabase = useSupabaseClient()
const bookings: any = ref([])

let startDate: Date
let endDate: Date
let diffDays: number
let longestStay: number = 0
let totalDays = 0

async function getBookings() {
  const { data } = await supabase.from('bookings').select().order('start_date', { ascending: true })
  bookings.value = data

  data?.forEach(function (book) {
    // Get total amount of days booked
    startDate = new Date(book.start_date.replace(' ', 'T') + 'Z')
    endDate = new Date(book.end_date.replace(' ', 'T') + 'Z')
    diffDays = Math.round((endDate.valueOf() - startDate.valueOf()) / (1000 * 3600 * 24))

    // Set statistics
    longestStay = diffDays > longestStay ? diffDays : longestStay
    totalDays += diffDays
  })
}

onMounted(() => {
  getBookings()
})
</script>

<template>
  <div class="mt-16">
    <h2 class="mb-6 md:flex items-center md:text-xl">
      Les statistiques
    </h2>

    <div v-if="bookings.length" class="">
      Nombre de réservations totales : <span class="text-bodil-800 font-bold">{{ bookings.length }}</span> <br />
      Nombre de jours totaux réservés : <span class="text-bodil-800 font-bold">{{ totalDays }}</span> <br />
      Plus long séjour : <span class="text-bodil-800 font-bold">{{ longestStay }}</span> <br />
      Meilleur bar de la ville : <span class="text-bodil-800 font-bold">Mieux Ici Qu'en Face</span> <br />
    </div>
  </div>

</template>

<style lang="scss"></style>
