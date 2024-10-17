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
      <span class="pl-1">
        <font-awesome-icon v-if=icon :icon="['fas', icon]" size="lg"/>
      </span>
    </div>
  </button>
</template>

<style scoped>
  button {
    @apply shadow-sm rounded;
    @apply p-2;

    @apply text-white bg-green-600;

    /* Hover */
    @apply hover:bg-green-500 hover:shadow;
    /* Actiive */
    @apply active:bg-green-700;
    
    /* Animations */
    @apply transition-all duration-200;
  }
</style>
