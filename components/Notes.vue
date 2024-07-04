<script setup>
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://avpzcqjfdludlryulhfz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHpjcWpmZGx1ZGxyeXVsaGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NDk1NjMsImV4cCI6MjAzMTUyNTU2M30.lCzfuVacJIa0aSRLcYPfDXgvj8V-2N-Vsu7NhOB7Jy8')
const notes = ref([])
const loading = ref(false)
const modalOpen = ref(false)
let noteDeleteId = ref(false)

async function getNotes() {
  const { data } = await supabase.from('notes').select().order('start_date', { ascending: true })
  notes.value = data
}

function formatDateFR(rawDate) {
  let formatedDate = new Date(rawDate)
  return formatedDate.toLocaleDateString('fr-FR')
}

function openDeleteModal(e) {
  modalOpen.value = true
  noteDeleteId = e.currentTarget.getAttribute('note')
}

async function deleteBooking(e) {
  let noteID = e.currentTarget.getAttribute('note')

  try {
    loading.value = true

    const { error } = await supabase.from('notes').delete().eq('id', noteID)
    if (error) throw error
    modalOpen.value = false
    getNotes()
  } catch (error) {
    console.warn(error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getNotes()
})
</script>

<template>
  <h2 class="mb-6 md:flex items-center md:text-xl">
    Petites notes :
  </h2>

  <div v-for="note in notes" :key="note.id" class="mt-4">
    <div class="card group">
      {{ note.content }}
    </div>
  </div>

  <!-- MODAL -->
  <div :class="modalOpen ? 'relative z-10' : 'relative z-10 hidden'" aria-labelledby="modal-note"
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
                  supprimer cette note ?</h3>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button type="button"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              @click.prevent="deleteBooking" :booking="noteDeleteId">Confirmer</button>

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
