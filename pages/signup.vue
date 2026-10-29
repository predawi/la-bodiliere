<script setup lang="ts">
import type { NewBooking } from "~/utils/bookings";

const today = useToday();
const { bookings, addBooking } = useBookings();
const mail = useMail();
const siteUrl = useRequestURL().origin;

const name = ref("");
const startDate = ref("");
const endDate = ref("");
const saving = ref(false);
const saveFailed = ref(false);
const saved = ref<NewBooking | null>(null);

const calendarLinks = computed(
  () =>
    saved.value && {
      google: googleCalendarUrl(saved.value, siteUrl),
      ics: icsDataUrl(bookingIcs(saved.value, siteUrl)),
    },
);

const upcoming = computed(() => upcomingBookings(bookings.value, today.value));
const check = computed(() =>
  checkStay(bookings.value, today.value, startDate.value, endDate.value),
);
const canSave = computed(
  () =>
    Boolean(name.value.trim()) && check.value.state === "free" && !saving.value,
);

async function save() {
  if (!canSave.value) return;
  const booking: NewBooking = {
    name: name.value.trim(),
    start_date: startDate.value,
    end_date: endDate.value,
  };

  saving.value = true;
  saveFailed.value = false;
  try {
    await addBooking(booking);
    saved.value = booking;
    notifyFamily(booking);
  } catch {
    saveFailed.value = true;
  } finally {
    saving.value = false;
  }
}

function notifyFamily(booking: NewBooking) {
  mail
    .send(bookingEmail(booking, siteUrl))
    .catch((error) => console.warn("Booking e-mail not sent", error));
}
</script>

<template>
  <div v-if="saved" class="mx-auto flex max-w-[560px] flex-col gap-7 pt-6">
    <section class="flex flex-col items-center gap-4 text-center" role="status">
      <span
        class="flex size-[88px] items-center justify-center rounded-full bg-algue-tint text-algue"
      >
        <AppIcon name="check" :size="48" />
      </span>
      <h1 class="m-0 text-[40px] leading-[1.1]">C'est réservé !</h1>
      <p class="m-0 max-w-[30ch] text-[19px]">
        Toute la famille voit maintenant ce séjour sur l'accueil.
      </p>
      <span class="wave w-20" aria-hidden="true" />
    </section>

    <StayCard :booking="{ id: 0, ...saved }" highlighted readonly />

    <section v-if="calendarLinks" class="flex flex-col gap-3">
      <h2 class="m-0 flex items-center gap-2 font-sans text-lg font-medium">
        <AppIcon name="calendar" :size="24" class="text-sea-strong" />
        Ajouter à mon agenda
      </h2>
      <div class="flex flex-col gap-3 sm:flex-row">
        <a
          :href="calendarLinks.google"
          target="_blank"
          rel="noopener"
          class="button button-secondary w-full sm:w-auto"
          >Google Agenda</a
        >
        <a
          :href="calendarLinks.ics"
          download="sejour-bodiliere.ics"
          class="button button-secondary w-full sm:w-auto"
          >iPhone, Outlook ou autre</a
        >
      </div>
    </section>
  </div>

  <div v-else class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h1 class="m-0 text-[38px] leading-[1.1] md:text-5xl">
        Réserver la maison
      </h1>
      <span class="wave w-20" aria-hidden="true" />
      <p class="m-0 mt-2 max-w-[60ch] text-lg text-ink-muted md:text-xl">
        Indiquez qui vient et à quelles dates.
      </p>
    </div>

    <div class="flex flex-wrap items-start gap-10">
      <form
        class="card flex min-w-0 flex-[1_1_440px] flex-col gap-6 p-5 md:p-8"
        novalidate
        @submit.prevent="save"
      >
        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium">Qui vient ?</label>
          <input
            id="name"
            v-model="name"
            type="text"
            autocomplete="off"
            class="field"
            aria-describedby="name-hint"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-2">
            <label for="start_date" class="font-medium">Date d'arrivée</label>
            <input
              id="start_date"
              v-model="startDate"
              type="date"
              :min="today"
              class="field"
              :aria-invalid="check.state === 'past'"
              :aria-describedby="
                check.state === 'past' ? 'start-date-error' : undefined
              "
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="end_date" class="font-medium">Date de départ</label>
            <input
              id="end_date"
              v-model="endDate"
              type="date"
              :min="startDate || today"
              class="field"
              :aria-invalid="check.state === 'order'"
              :aria-describedby="
                check.state === 'order' ? 'end-date-error' : undefined
              "
            />
          </div>
        </div>

        <p
          v-if="check.state === 'past'"
          id="start-date-error"
          class="m-0 flex items-center gap-1.5 font-medium text-bouee"
        >
          <AppIcon name="alert" />
          Choisis une date d'arrivée à partir d'aujourd'hui.
        </p>

        <p
          v-else-if="check.state === 'order'"
          id="end-date-error"
          class="m-0 flex items-center gap-1.5 font-medium text-bouee"
        >
          <AppIcon name="alert" />
          Choisis une date de départ après la date d'arrivée.
        </p>

        <div
          v-else-if="check.state === 'overlap'"
          role="alert"
          class="flex gap-3 rounded-field bg-bouee-tint p-4"
        >
          <AppIcon name="alert" :size="24" class="mt-0.5 text-bouee" />
          <div>
            <strong class="block font-semibold text-bouee"
              >La maison est déjà prise : {{ check.booking.name }},
              {{
                formatStayRange(
                  check.booking.start_date,
                  check.booking.end_date,
                  false,
                )
              }}.</strong
            >
            Choisis d'autres dates.
          </div>
        </div>

        <div
          v-else-if="check.state === 'free'"
          role="status"
          class="flex gap-3 rounded-field bg-algue-tint p-4"
        >
          <AppIcon name="check-circle" :size="24" class="mt-0.5 text-algue" />
          <div>
            <strong class="block font-semibold text-algue"
              >La maison est libre.</strong
            >
            {{ formatStayRange(startDate, endDate) }},
            {{ formatNights(check.nights) }}.
          </div>
        </div>

        <p
          v-if="saveFailed"
          role="alert"
          class="m-0 flex gap-3 rounded-field bg-bouee-tint p-4 text-bouee"
        >
          <AppIcon name="alert" :size="24" />
          La réservation n'a pas pu être enregistrée. Réessaie dans un instant.
        </p>

        <button
          type="submit"
          class="button button-primary button-lg w-full sm:w-auto sm:self-start"
          :disabled="!canSave"
        >
          {{ saving ? "Enregistrement…" : "Enregistrer la réservation" }}
        </button>
      </form>

      <aside
        class="card flex min-w-0 flex-[1_1_360px] flex-col gap-4 p-5 md:p-6"
      >
        <h2 class="m-0 text-[28px] leading-tight">Déjà réservé</h2>
        <p v-if="!upcoming.length" class="m-0 text-ink-muted">
          Rien pour le moment : toutes les dates sont libres.
        </p>
        <ul v-else class="m-0 flex list-none flex-col p-0">
          <li
            v-for="booking in upcoming"
            :key="booking.id"
            class="flex flex-col gap-0.5 border-b border-galet py-3 first:pt-0 last:border-0 last:pb-0"
          >
            <span class="font-display text-[28px] leading-tight">{{
              booking.name
            }}</span>
            <span>{{
              formatStayRange(booking.start_date, booking.end_date)
            }}</span>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
