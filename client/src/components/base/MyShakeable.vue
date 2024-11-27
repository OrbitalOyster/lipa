<script setup lang="ts">
import { sleep } from '../../utils.ts'
import { useTemplateRef } from 'vue'

const root = useTemplateRef<HTMLElement>('root'),
  shakeTime = 250,
  shake = async () => {
    root.value?.classList.add('shake')
    await sleep(shakeTime)
    root.value?.classList.remove('shake')
  }

defineExpose({ shake })
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>
