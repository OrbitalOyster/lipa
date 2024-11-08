<script setup>
  import { ref } from 'vue'
  defineProps({
    slots: Array
  }); 

  const selected = ref('')
</script>

<template>
  <ul>
    <li v-for="slot in slots" :key="slot.title" :class="{grow: slot.title === selected, 'overflow-auto': slot.title === selected}">
      <div class="toggle" @click="selected = selected === slot.title ? '' : slot.title">
        <h1>
          <span class="inline-block w-10"><font-awesome-icon :icon="['fas', slot.icon]" size="xl" /></span>
          {{slot.title}}
        </h1>
      </div>
      <div class="mt-1" v-if="slot.title === selected">
        <div class="overflow-auto">
          <slot :name="slot.title"/>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
  ul {
    @apply flex flex-col h-full space-y-2;
  }

  h1 {
  }

  li {
    @apply bg-white;
    @apply outline-none border border-slate-300 rounded;
    @apply drop-shadow;
    @apply transition-all duration-100;
  }

  .toggle {
    @apply text-slate-600;
    @apply flex justify-between items-center;
    @apply sticky top-0 bg-white;
    @apply drop-shadow;
    @apply cursor-pointer select-none p-2;
  }
</style>
