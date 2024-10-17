<script setup lang="ts">
  defineProps({
    title: String,
    icon: String,
  });
</script>

<template>
  <button type="button">
    <div class="px-2">
      {{title}}
    </div>
  </button>
</template>

<style scoped>
  button {
    @apply shadow-md rounded;
    @apply p-2;

    @apply text-white bg-green-600;

    /* Hover */
    @apply hover:bg-green-500;
    /* Actiive */
    @apply active:bg-green-700;
    
  }
</style>
