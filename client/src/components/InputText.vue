<script setup lang="ts">
defineProps({
  password: Boolean,
})
// eslint-disable-next-line no-useless-assignment
const model = defineModel<string>()
</script>

<template>
  <input
    class="p-2"
    v-model="model"
    type="text"
  >
</template>

<style scoped>
  .focus-outline:focus {
    box-shadow: 0 0 0 .25rem green;
  }

  input {
    /* Border */
    @apply outline-none border border-gray-300 rounded;
    @apply bg-gray-50;
    /* On focus */
    @apply focus:outline-2 focus:outline-green-400;
    /* Animations */
    @apply transition-all duration-200;
  }

</style>
