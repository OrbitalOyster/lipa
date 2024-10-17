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
  input {
    /* Border */
    @apply outline-none border border-slate-300 rounded;
    @apply bg-slate-50;
    /* On focus */
    @apply focus:outline-2 focus:outline-emerald-400;
    /* Animations */
    @apply transition-all duration-200;
  }

</style>
