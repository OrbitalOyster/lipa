<script setup>
  import { ref } from 'vue'
  defineProps({
    slots: Array
  }); 

  const selected = ref('')
</script>

<template>
  <ul class="h-full">
    <!-- <li v-for="slot in slots" :key="slot.title" :class="{grow: slot.title === selected, 'overflow-auto': slot.title === selected}"> -->
    <li v-for="slot in slots" :key="slot.title" :class="{grow: slot.title === selected}">
      <div class="toggle" @click="selected = selected === slot.title ? '' : slot.title">
        <h1>
          <span class="inline-block w-10"><font-awesome-icon :icon="['fas', slot.icon]" size="xl" /></span>
          {{slot.title}}
        </h1>
      </div>
      <div class="slot-container overflow-auto h-full" v-if="slot.title === selected">
        <slot :name="slot.title"/>
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
    @apply min-h-12 overflow-hidden;
    @apply bg-white;
    @apply outline-none border border-slate-300 rounded;
    @apply drop-shadow;
    @apply transition-all duration-100;
  }

  .toggle {
    @apply h-12;
    @apply text-slate-600;
    @apply flex justify-between items-center;
    /* @apply sticky top-0 bg-white; */
    @apply drop-shadow;
    @apply cursor-pointer select-none p-2;
  }

  .slot-container {
    height: calc(100% - 3rem);
  }
</style>
