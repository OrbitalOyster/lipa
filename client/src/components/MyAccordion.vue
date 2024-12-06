<script setup lang="ts">
import { ref } from 'vue'
defineProps<{
  slots: {
    title: string
    icon: string
  }[]
}>()
// eslint-disable-next-line no-useless-assignment
const selected = ref('')
</script>

<template>
  <ul class="h-full flex flex-col space-y-2">
    <li
      v-for="slot in slots"
      :key="slot.title"
      class="card min-h-14 overflow-hidden transition-[flex-grow]"
      :class="slot.title === selected && 'grow'"
    >
      <div
        class="pr-3 h-14 text-slate-700 flex justify-between items-center drop-shadow cursor-pointer select-none"
        @click="selected = selected === slot.title ? '' : slot.title"
      >
        <h1>
          <div class="inline-block w-12 text-center">
            <font-awesome-icon
              :icon="['fas', slot.icon]"
              size="xl"
            />
          </div>
          {{ slot.title }}
        </h1>
        <div
          class="text-slate-500 transition-transform"
          :class="{ 'rotate-180': slot.title === selected}"
        >
          <font-awesome-icon
            :icon="['fas', 'angle-down']"
            size="xl"
          />
        </div>
      </div>
      <div
        v-if="slot.title === selected"
        class="slot-container overflow-auto h-full"
      >
        <slot :name="slot.title" />
      </div>
    </li>
  </ul>
</template>

<style scoped>
  .slot-container {
    /* Substract toggler height */
    height: calc(100% - 3rem);
  }
</style>
