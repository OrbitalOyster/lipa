<script setup lang="ts">
import { ref } from 'vue'

interface ISlot {
  title: string
  icon: string
}

const props = defineProps<{
    slots: ISlot[]
  }>(),
  // eslint-disable-next-line no-useless-assignment
  selected = ref(props.slots[0].title)
</script>

<template>
  <main>
    <ul>
      <li
        v-for="slot in slots"
        :key="slot.title"
        :class="{'selected': slot.title === selected}"
      >
        <h1
          class="space-x-2"
          @click="selected = slot.title"
        >
          <span class="inline-block text-center"><font-awesome-icon
            :icon="['fas', slot.icon]"
            size="lg"
          /></span>
          <span>{{ slot.title }}</span>
        </h1>
      </li>
    </ul>
    <div
      v-for="slot in slots"
      :key="slot.title"
      class="tab pt-2"
      :class="{hidden: slot.title !== selected}"
    >
      <slot :name="slot.title" />
    </div>
  </main>
</template>

<style scoped>
  ul {
    @apply flex flex-row;
  }

  li {
    @apply relative px-2 py-2 pb-2 mt-3;
    @apply bg-white text-slate-400;
    @apply outline-none border-t rounded-t border-l border-r border-slate-200;
    @apply transition-all duration-100;
  }

  li.selected {
    @apply mt-0;
    @apply text-slate-600 border-slate-300;
    @apply z-10 translate-y-0.5;
  }

  h1 {
    @apply cursor-pointer select-none;
    @apply underline-offset-4 whitespace-nowrap;
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
