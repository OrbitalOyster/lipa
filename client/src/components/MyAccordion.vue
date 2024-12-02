<script setup lang="ts">
import { ref } from 'vue'

interface ISlot {
  title: string
  icon: string
}

defineProps<{
  slots: ISlot[]
}>()

// eslint-disable-next-line no-useless-assignment
const selected = ref('')
</script>

<template>
  <ul class="h-full flex flex-col space-y-2">
    <li
      v-for="slot in slots"
      :key="slot.title"
      class="card min-h-12 overflow-hidden transition-all"
      :class="{grow: slot.title === selected}"
    >
      <div
        class="toggle"
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
  .toggle {
    @apply bg-white h-12 p-1 pr-3;
    @apply text-slate-700;
    @apply flex justify-between items-center;
    @apply drop-shadow;
    @apply cursor-pointer select-none;
  }

  .slot-container {
    /* Substract toggler height */
    height: calc(100% - 3rem);
  }
</style>
