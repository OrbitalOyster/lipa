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
    <ul class="flex flex-row">
      <li
        v-for="slot in slots"
        :key="slot.title"
        class="cursor-pointer select-none whitespace-nowrap"
        :class="{'selected': slot.title === selected}"
        @click="selected = slot.title"
      >
        <h1>
          <font-awesome-icon
            class="w-6"
            :icon="['fas', slot.icon]"
            size="lg"
          />
          <span>{{ slot.title }}</span>
        </h1>
      </li>
    </ul>
    <div
      v-for="slot in slots"
      :key="slot.title"
      class="card pt-2 h-full"
      :class="{hidden: slot.title !== selected}"
    >
      <slot :name="slot.title" />
    </div>
  </main>
</template>

<style scoped>
  li {
    @apply relative px-2 py-2 pb-2 mt-3;
    @apply bg-white text-slate-400;
    @apply outline-none border-t rounded-t border-l border-r border-slate-200;
    @apply duration-100;
  }

  li.selected {
    @apply mt-0;
    @apply text-slate-600 border-slate-300;
    @apply z-10 translate-y-0.5;
  }
</style>
