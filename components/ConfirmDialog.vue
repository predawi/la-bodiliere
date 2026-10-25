<script setup lang="ts">
defineProps<{ title: string, confirmLabel: string, cancelLabel: string }>()
const emit = defineEmits<{ confirm: [], cancel: [] }>()

const titleId = useId()
const dialog = ref<HTMLElement>()
const cancelButton = ref<HTMLButtonElement>()
let previousFocus: HTMLElement | null = null

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('cancel')
    return
  }
  if (event.key !== 'Tab' || !dialog.value) return

  const buttons = [...dialog.value.querySelectorAll('button')]
  const first = buttons[0]
  const last = buttons[buttons.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  previousFocus = document.activeElement as HTMLElement | null
  cancelButton.value?.focus()
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  previousFocus?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-20 flex items-end justify-center bg-[rgba(15,42,53,0.5)] p-4 pb-8 sm:items-center"
      @click.self="emit('cancel')"
    >
      <div
        ref="dialog"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        class="flex w-full max-w-[460px] flex-col gap-4 rounded-card bg-surface p-6 shadow-dialog"
      >
        <span class="flex size-14 items-center justify-center rounded-full bg-bouee-tint text-bouee">
          <AppIcon name="trash" :size="28" />
        </span>
        <h3 :id="titleId" class="m-0 text-[28px] leading-tight">{{ title }}</h3>
        <p class="m-0 text-ink-muted"><slot /></p>
        <div class="flex flex-wrap-reverse justify-end gap-3">
          <button ref="cancelButton" type="button" class="button button-secondary w-full sm:w-auto" @click="emit('cancel')">
            {{ cancelLabel }}
          </button>
          <button type="button" class="button button-danger w-full sm:w-auto" @click="emit('confirm')">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
