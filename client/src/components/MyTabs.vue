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

    <div class="flex justify-between p-2 border rounded bg-white overflow-x-auto">
      <ul>
        <li v-for="slot in slots" :key="slot.title">
          <h1 @click="selected = slot.title" :class="{'underline': slot.title === selected}">
            <span class="inline-block w-6"><font-awesome-icon :icon="['fas', slot.icon]" /></span>
            {{slot.title}}
          </h1>
        </li>
      </ul>
      <slot name="toolbar"/> 
    </div>

    <div class="tab" v-for="slot in slots" :key="slot.title" :class="{hidden: slot.title !== selected}">
      <slot :name="slot.title"/>
    </div>

  </main>
</template>

<style scoped>
  ul {
    @apply flex flex-row;
  }

  h1 {
    @apply cursor-pointer select-none p-2 text-slate-600;
    @apply underline-offset-4 whitespace-nowrap;
  }

  li {
    @apply bg-white;
    @apply outline-none border border-slate-300 rounded;
    @apply drop-shadow;
    @apply transition-all duration-100;
  }

  .tab {
    /* Sizing */
    @apply p-4 space-y-4;
    /* Border */
    @apply border border-slate-300 rounded;
    /* Colors */
    @apply bg-white;
    /* Effects */
    @apply drop-shadow;
  }
</style>
