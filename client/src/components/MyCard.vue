<script setup lang="ts">

import { Ref, useTemplateRef } from 'vue'
import { sleep } from '../utils.ts'

defineProps({
  title: {
    type: String,
    default: 'INSERT TITLE',
  },
  subtitle: {
    type: String,
    default: 'INSERT TITLE',
  },
})

const main: Ref<HTMLElement | null> = useTemplateRef('main'),
  shakeTime = 250,
  shake = async () => {
    if (!main.value) {
      throw new Error('Major screwup')
    }
    main.value.classList.add('shake')
    await sleep(shakeTime)
    main.value.classList.remove('shake')
  }

defineExpose({ shake })

</script>

<template>
  <main
    ref="main"
    class="p-4"
  >
    <slot />
  </main>
</template>

<style scoped>
  main {
    /* Border */
    @apply border border-slate-300 rounded;
    /* Colors */
    @apply bg-white;
    /* Effects */
    @apply drop-shadow;
  }

</style>
