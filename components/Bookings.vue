<script setup>
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://avpzcqjfdludlryulhfz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHpjcWpmZGx1ZGxyeXVsaGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NDk1NjMsImV4cCI6MjAzMTUyNTU2M30.lCzfuVacJIa0aSRLcYPfDXgvj8V-2N-Vsu7NhOB7Jy8')
const bookings = ref([])
const loading = ref(false)
const modalOpen = ref(false)
let bookingDeleteId = ref(false)

async function getBookings() {
  const { data } = await supabase.from('bookings').select().order('start_date', { ascending: true })
  bookings.value = data
}

function formatDateFR(rawDate) {
  let formatedDate = new Date(rawDate)
  return formatedDate.toLocaleDateString('fr-FR')
}

function openDeleteModal(e) {
  modalOpen.value = true
  bookingDeleteId = e.currentTarget.getAttribute('booking')
}

async function deleteBooking(e) {
  let bookingID = e.currentTarget.getAttribute('booking')

  try {
    loading.value = true

    const { error } = await supabase.from('bookings').delete().eq('id', bookingID)
    if (error) throw error
    modalOpen.value = false
    getBookings()
  } catch (error) {
    console.warn(error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getBookings()
})
</script>

<template>
  <h2 class="mb-6 md:flex items-center md:text-xl">
    Prochaines réservations à la <span class="font-custom text-2xl text-bodil-800">&nbsp;Bodilière&nbsp;</span> :
  </h2>


  <div v-if="bookings.length" class="grid grid-cols-3 md:grid-cols-4 font-bold">
    <div class="pl-3">Qui ?</div>
    <div>A partir du :</div>
    <div>Jusqu'au :</div>
  </div>

  <div class="card" v-if="!bookings.length">
    Aucune réservation pour le moment
  </div>


  <div v-for="booking in bookings" :key="booking.id" class="mt-4">
    <div class="card group">
      <div class="grid grid-cols-3 md:grid-cols-4">
        <div class="flex items-center"><span class="font-custom text-xl">{{ booking.name }}</span></div>
        <div class="flex items-center">{{ formatDateFR(booking.start_date) }}</div>
        <div class="flex items-center">{{ formatDateFR(booking.end_date) }}</div>
        <div class="flex items-center justify-end">
          <button @click.prevent="openDeleteModal" :booking="booking.id" :disabled="loading"
            class="items-center text-red-600 hidden md:group-hover:inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mr-2">
              <path fill="currentColor"
                d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1zM7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM7 6v13z" />
            </svg>
            <span>Supprimer</span>
          </button>
        </div>
      </div>
      <button @click.prevent="openDeleteModal" :booking="booking.id" :disabled="loading"
        class="flex items-center text-red-600 md:hidden ml-auto mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mr-2">
          <path fill="currentColor"
            d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1zM7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM7 6v13z" />
        </svg>
        <span>Supprimer</span>
      </button>
    </div>
  </div>

  <!-- MODAL -->
  <div :class="modalOpen ? 'relative z-10' : 'relative z-10 hidden'" aria-labelledby="modal-semi"
    id="modalRemoveBooking" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-center">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11 14V5h2v9zm0 5v-2h2v2z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-semi">Es-tu sûr de vouloir
                  supprimer cette réservation ?</h3>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button type="button"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              @click.prevent="deleteBooking" :booking="bookingDeleteId">Confirmer</button>

            <button type="button"
              class="inline-flex w-full justify-center rounded-md bg-bodil-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-bodil-500 sm:ml-3 sm:w-auto mt-4 md:mt-0"
              @click.prevent="modalOpen = false">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss"></style>
