<script setup lang="ts">
import GooseCheckbox from '#components/GooseCheckbox.vue'

defineProps<{
  checks?: FormCheck[]
}>()

const model = defineModel<boolean>()
</script>

<template>
  <GooseCheckbox
    v-model="model"
  >
    <slot />
  </GooseCheckbox>
</template>
