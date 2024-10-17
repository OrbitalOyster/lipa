<script setup lang="ts">
  defineProps({
    title: String,
    subtitle: String, 
  })
</script>

<template>
  <main class="p-4">
    <div class="pb-4">
      <h1>{{title}}</h1>
      <h2>{{subtitle}}</h2>
    </div>
    <slot/>
    <slot name="footer"/>
  </main>
</template>

<style scoped>
  main {
    /* Border */
    @apply outline-none border border-gray-200 rounded;
    @apply bg-white;

    @apply shadow-sm;
  }

  h1 {
    @apply text-3xl font-bold text-gray-600;
  }

  h2 {
    @apply text-lg text-gray-400;
  }
</style>
