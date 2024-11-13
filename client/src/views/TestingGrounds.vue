<script setup>
import LoremIpsum from '../components/LoremIpsum.vue'
import MyButton from '../components/MyButton.vue'
import MyPopover from '../components/MyPopover.vue'
</script>

<template>
  <div class="flex w-screen h-screen items-center justify-center">
    <main class="overflow-auto">
      <h1>Testing grounds</h1>
      <LoremIpsum />
      <MyPopover>
        <MyButton title="Button" />
        <template #popover>
          <p>Tooltip</p>
        </template>
      </MyPopover>
      <LoremIpsum />
    </main>
  </div>
</template>

<style scoped>
  main {
    @apply w-1/2 h-1/2 bg-sky-200 p-4;
  }
</style>
