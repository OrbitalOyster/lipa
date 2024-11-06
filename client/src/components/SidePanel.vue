<script setup lang="ts">
import { ref } from 'vue'
const width = ref(300)
</script>

<template>
  <div>
    <div class="switch-button">
      <font-awesome-icon
        :icon="['fas', 'ellipsis-vertical']"
        size="2x"
      />
    </div>
    <div class="bg-rose-400 fixed left-8 h-screen"> 
      <p>Hello</p>
    </div>
  </div>
</template>

<style scoped>
  .switch-button {
    @apply fixed top-1/2 text-slate-600 p-3 cursor-pointer select-none;
    @apply bg-green-100;
  }
</style>
