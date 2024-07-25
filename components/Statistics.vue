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
    let bookItem = <any>book;
    // Get total amount of days booked
    startDate = new Date(bookItem.start_date.replace(' ', 'T') + 'Z')
    endDate = new Date(bookItem.end_date.replace(' ', 'T') + 'Z')
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
    <HeadingH2 title="Les statistiques" icon="Graph" />

    <div v-if="bookings.length" class="">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatisticsItem text="Nombre de réservations totale" :stat=bookings.length />
        <StatisticsItem text="Nombre de jours totaux réservés" :stat=totalDays unit="jours" />
        <StatisticsItem text="Plus long séjour" :stat=longestStay unit="jours" />
        <StatisticsItem text="Meilleur bar de la ville" stat="Mieux Ici Qu'en Face" />
      </div>
    </div>
  </div>

</template>

<style lang="scss"></style>
