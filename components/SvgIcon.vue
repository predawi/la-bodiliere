<template>
  <component :is="dynamicComponent" />
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    dynamicComponent() {
      const name = this.name;

      return defineAsyncComponent(() => import(`./Icons/${name}.vue`));
    },
  },
};
</script>
