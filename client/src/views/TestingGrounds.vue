<script setup>
import MyButton from '../components/MyButton.vue'
import MyPopover from '../components/MyPopover.vue'
import LoremIpsum from '../components/LoremIpsum.vue'

import { computed, onMounted, ref } from 'vue'
import { arrow, autoPlacement, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
const reference = ref(null),
  floating = ref(null),
  floatingArrowRef = ref(null),

  { floatingStyles, middlewareData } = useFloating(reference, floating, {
    middleware: [offset(12), autoPlacement(), arrow({ element: floatingArrowRef })],
    whileElementsMounted: autoUpdate,
  }),
  style = computed(() => {
    const side = middlewareData.value.offset?.placement.split('-')[0],
      rotation = { top: -135, right: -45, bottom: 45, left: 135 }[side]
    return {
      transform: `rotate(${rotation}deg)`,
      left: middlewareData.value.arrow?.x != null
        ? `${middlewareData.value.arrow.x}px`
        : `${floating.value?.offsetWidth * (side === 'left') - 9}px`,
      top: middlewareData.value.arrow?.y != null
        ? `${middlewareData.value.arrow.y}px`
        : `${floating.value?.offsetHeight * (side === 'top') - 9}px`,
    }
  })
</script>

<template>
  <div class="flex w-screen h-screen items-center justify-center">
    <main>
      <h1>Testing grounds</h1>
      <LoremIpsum />
      <MyButton
        ref="reference"
        title="Button"
        @click="console.log(middlewareData)"
      />
      <div
        ref="floating"
        class="floating"
        :style="floatingStyles"
      >
        <p>Hello World!</p>
        <div
          ref="floatingArrowRef"
          class="arrow"
          :style="style"
        />
      </div>
      <LoremIpsum />
    </main>
  </div>
</template>

<style scoped>
  main {
    @apply w-1/2 h-1/2 bg-sky-200 p-4;
  }

  .floating {
    @apply absolute top-0 left-0 px-6 py-3;
    @apply border border-slate-300 rounded;
    @apply bg-white;
    @apply drop-shadow;
  }

  .arrow {
    width: 16px;
    height: 16px;
    @apply absolute bg-white;
    @apply border-slate-300 border-t border-l;
  }
</style>
