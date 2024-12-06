<script setup lang="ts">
import { useTemplateRef } from 'vue'
const root = useTemplateRef('root'),
  shakeTime = 250,
  shake = () => {
    root.value?.classList.add('shake')
    setTimeout(() => root.value?.classList.remove('shake'), shakeTime)
  }
defineExpose({ shake })
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>
