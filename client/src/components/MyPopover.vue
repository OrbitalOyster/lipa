<script setup lang="ts">
</script>

<template>
  <div class="absolute top-0 left-0 px-6 py-3">
    <slot />
  </div>
</template>

<style scoped>
  div {
    @apply border border-slate-300 rounded;
    @apply bg-white;
    @apply drop-shadow;
  }
</style>
