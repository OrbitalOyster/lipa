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
    @apply outline-none border border-gray-200 rounded;
    @apply bg-white;

    @apply shadow-sm;
  }

</style>
