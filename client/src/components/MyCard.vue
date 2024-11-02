<script setup lang="ts">

import { Ref, useTemplateRef } from 'vue'
import { sleep } from '../utils.ts'

defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
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
  >
    <header>
      <img
        v-if="icon"
        :src="icon"
      >
      <h1>
        {{ title }}
      </h1>
      <h2>
        {{ subtitle }}
      </h2>
    </header>
    <slot />
  </main>
</template>

<style scoped>
  main {
    /* Sizing */
    @apply p-4 space-y-4;
    /* Border */
    @apply border border-slate-300 rounded;
    /* Colors */
    @apply bg-white;
    /* Effects */
    @apply drop-shadow;
  }

  /* Title */
  h1 {
    @apply text-3xl font-bold text-slate-600;
  }

  /* Subtitle */
  h2 {
    @apply text-lg text-slate-400;
  }

  /* Icon */
  img {
    @apply float-right w-14 h-14;
  }
</style>
