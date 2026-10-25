<script setup lang="ts">
type IconName = 'calendar' | 'trash' | 'check' | 'check-circle' | 'alert' | 'chevron-left' | 'chevron-right' | 'sun' | 'cloud' | 'rain' | 'snow'

withDefaults(defineProps<{ name: IconName, size?: number }>(), { size: 20 })

const CLOUD_HIGH = 'M7 15h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 15z'
const CIRCLE = 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0'

const PATHS: Record<IconName, string> = {
  'calendar': 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM16 3v4M8 3v4M3 10h18',
  'trash': 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  'check': 'M5 12.5l4.5 4.5L19 7.5',
  'check-circle': `${CIRCLE}M8 12l3 3 5-6`,
  'alert': `${CIRCLE}M12 8v5M12 16h.01`,
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  'sun': 'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  'cloud': 'M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 18z',
  'rain': `${CLOUD_HIGH}M8 18l-1 3M12 18l-1 3M16 18l-1 3`,
  'snow': `${CLOUD_HIGH}M8 19h.01M12 21h.01M16 19h.01`,
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="flex-none"
  >
    <path :d="PATHS[name]" />
  </svg>
</template>
