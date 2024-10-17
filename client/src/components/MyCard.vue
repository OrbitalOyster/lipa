<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'INSERT TITLE',
  },
  subtitle: {
    type: String,
    default: 'INSERT TITLE',
  },
})
</script>

<template>
  <main class="p-4">
    <slot />
  </main>
</template>

<style scoped>
  main {
    /* Border */
    @apply border border-slate-300 rounded;
    /* Colors */
    @apply bg-white;
    /* Effects */
    @apply drop-shadow;
  }

</style>
