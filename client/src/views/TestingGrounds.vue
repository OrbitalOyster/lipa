<script setup lang="ts">
import LoremIpsum from '../components/LoremIpsum.vue'
import MyPopover from '../components/MyPopover.vue'
import { useTemplateRef } from 'vue'

// eslint-disable-next-line no-useless-assignment
const popover = useTemplateRef('popover')
</script>

<template>
  <div class="flex w-screen h-screen items-center justify-center">
    <main class="overflow-auto">
      <h1>Testing grounds</h1>
      <LoremIpsum />

      <MyPopover
        ref="popover"
        placement="right"
        has-arrow
      >
        <template #popover>
          <LoremIpsum />
        </template>
        <div
          class="text-center bg-pink-300 w-64"
          @click="popover?.toggle"
        >
          Target
        </div>
      </MyPopover>

      <LoremIpsum />
    </main>
  </div>
</template>

<style scoped>
  main {
    @apply w-2/3 h-full bg-sky-200 p-4;
  }
</style>
