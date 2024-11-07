<script setup>
  import { ref } from 'vue'
  const props = defineProps({
    slots: Array
  }); 

  const selected = ref('')
</script>

<template>
  <ul>
    <li v-for="slot in slots" :key="slot.title" :class="{grow: slot.title === selected, 'overflow-auto': slot.title === selected}">
      <div @click="selected = slot.title">
        <h1>
          <span class="inline-block w-6"><font-awesome-icon :icon="['fas', slot.icon]" /></span>
          {{slot.title}}
        </h1>
      </div>
      <div class="mt-1" v-if="slot.title === selected">
        <hr />
        <slot  :name="slot.title"/>
      </div>
    </li>
  </ul>
</template>

<style scoped>
  ul {
    @apply flex flex-col h-full space-y-2;
  }

  h1 {
    @apply text-slate-600;
    @apply cursor-pointer select-none p-2;
  }

  li {
    @apply p-1 bg-white;
    @apply border border-slate-300 rounded;
    @apply drop-shadow;
    @apply transition-all duration-100;
  }
</style>
