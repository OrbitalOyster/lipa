<script setup lang="ts">
import GooseCheckbox from '#components/GooseCheckbox.vue'
import type { Ref } from 'vue'
import { inject } from 'vue'

defineProps<{
  checks?: FormCheck[]
  name: string
}>()

const inputs: Ref<Record<string, FormInput>> | undefined = inject('inputs')

if (!inputs)
  throw new Error('Major fuck up')
</script>

<template>
  <GooseCheckbox
    v-model="inputs[name] as boolean | null"
  >
    <slot />
  </GooseCheckbox>
</template>
