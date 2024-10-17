<script setup lang="ts">
const props = defineProps({
})
// eslint-disable-next-line no-useless-assignment
const model = defineModel<string>()
</script>

<template>
  <input
    v-model="model"
    type="text"
  >
</template>

<style scoped>
  input {
    /* Border */
    @apply outline-none border border-gray-300 rounded;
    @apply p-2;
    /* On hover */
    @apply hover:border-green-500;
    /* On focus */
    /* @apply focus:border focus:border-green-500; */
    @apply focus:shadow-md;

    @apply bg-gray-50;
    /* Animations */
    @apply transition-all duration-200;
  }
</style>
