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
    @apply drop-shadow-md rounded;

    @apply outline-none text-white bg-green-500;

    /* Hover */
    @apply hover:bg-green-400 hover:shadow;

    /* Focus */
    @apply focus:outline-2 focus:outline-green-400;

    /* Active */
    @apply active:bg-green-700;

    /* Animations */
    @apply transition-all duration-200;
  }
</style>
