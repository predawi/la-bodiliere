<script setup lang="ts">
import { useDateFormat, useNow } from '@vueuse/core'

const currentDate = useDateFormat(useNow(), 'YYYY-MM-DD')

const supabase = useSupabaseClient()
const loading = ref(false)
const success = ref(false)

const name = ref('')
const start_date = ref('')
const end_date = ref('')

async function addBooking() {
  try {
    loading.value = true

    const insert = {
      name: name.value,
      start_date: start_date.value,
      end_date: end_date.value,
    }

    const { error } = await supabase.from('bookings').insert(insert, {
      returning: 'minimal', // Don't return the value after inserting
    })
    if (error) throw error
    success.value = true
  } catch (error) {
    console.error(error.message)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="container pt-14 pb-14 md:pb-0 mx-auto">
    <div class="flex-1">
      <div class="p-6 border rounded-xl bg-white">
        <HeadingH2 title="Ajouter une réservation" icon="Booking" />

        <form class="form-widget mt-4" @submit.prevent="addBooking">
          <div>
            <label for="name" class="block mb-2">Qui ?</label>
            <input id="name" type="text" v-model="name"
              class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bodil-500 focus:border-bodil-500 block w-full p-2.5"
              required />
          </div>
          <div>
            <label for="start_date" class="block mb-2">De quand ?</label>
            <input id="start_date" type="date" v-model="start_date" :min=currentDate
              class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bodil-500 focus:border-bodil-500 block w-full p-2.5"
              required />
          </div>
          <div>
            <label for="end_date" class="block mb-2">A quand ?</label>
            <input id="end_date" type="date" v-model="end_date" :min=currentDate
              class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bodil-500 focus:border-bodil-500 block w-full p-2.5"
              required />
          </div>

          <div class="mt-8">
            <input type="submit" class="button" :value="loading ? 'En attente ...' : 'Ajouter'" :disabled="loading" />
          </div>
        </form>
      </div>

      <!-- MODAL SUCCESS -->
      <div :class="success ? 'relative z-10' : 'relative z-10 hidden'" aria-labelledby="modal-semi" id="modalAddBooking"
        role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
            <div
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-center">
                  <div
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" aria-hidden="true" class="-6 w-6 text-green-700">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-semi">Créneau réservé !</h3>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button"
                  class="inline-flex w-full justify-center rounded-md bg-bodil-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-bodil-500 sm:ml-3 sm:w-auto"
                  @click.prevent="success = false">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>