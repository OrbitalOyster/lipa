<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'INSERT TITLE',
  },
  icon: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <button type="button">
    <div class="p-2 px-8">
      {{ title }}
      <span class="pl-1">
        <font-awesome-icon
          v-if="icon"
          :icon="['fas', icon]"
          size="lg"
        />
      </span>
    </div>
  </button>
</template>

<style scoped>
  button {
    @apply rounded outline-none text-white bg-emerald-500;

    /* Hover */
    @apply hover:bg-emerald-400 hover:drop-shadow-md;

    /* Focus */
    @apply focus:outline-2 focus:outline-emerald-400;

    /* Active */
    @apply active:bg-emerald-700;

    /* Animations */
    @apply transition-all duration-200;
  }
</style>
