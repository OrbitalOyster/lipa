<script setup lang="ts">
  import { ref } from 'vue'
  import LoremIpsum from '../components/LoremIpsum.vue'
  const props = defineProps({
    slots: Array
  }); 

  const selected = ref(props.slots[0].title)
</script>

<template>
  <main>
    <ul>
      <li v-for="slot in slots" :key="slot.title" :class="{'selected': slot.title === selected}">
        <h1 class="space-x-2"@click="selected = slot.title">
          <span class="inline-block text-center"><font-awesome-icon :icon="['fas', slot.icon]" size="lg" /></span>
          <span>{{slot.title}}</span>
        </h1>
        <div class="curtain"></div>
      </li>
    </ul>
    <div class="tab pt-2" v-for="slot in slots" :key="slot.title" :class="{hidden: slot.title !== selected}">
      <slot :name="slot.title"/>
    </div>
  </main>
</template>

<style scoped>
  ul {
    @apply flex flex-row;
  }

  li {
    @apply relative px-2 py-2 pb-4 top-3;
    @apply bg-white text-slate-400;
    @apply outline-none border-t rounded-t border-l border-r border-slate-200;
    @apply transition-all duration-100;
  }

  li.selected {
    @apply top-0;
    @apply text-slate-600 border-slate-300;
  }

  h1 {
    @apply cursor-pointer select-none;
    @apply underline-offset-4 whitespace-nowrap;
  }

  .curtain {
    @apply bg-white;
    @apply absolute;
    @apply w-full h-1 -bottom-0.5 left-0;
    @apply z-50
  }

  .tab {
    /* Sizing */
    @apply space-y-4 h-full;
    /* Border */
    @apply border border-slate-300 rounded rounded-tl-none;
    /* Colors */
    @apply bg-white;
    /* Effects */
    @apply drop-shadow;
  }
</style>
