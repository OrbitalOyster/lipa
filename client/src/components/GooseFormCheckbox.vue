<script setup lang="ts">
import type { FormCheck } from '#stores/useFormStore.ts'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import { useFormStore } from '#stores/useFormStore.ts'

const props = defineProps<{
    checks?: FormCheck[]
    disabled?: boolean
    form: string
    name: string
  }>(),
  store = useFormStore(props.form)

store.checks[props.name] = props.checks ?? []
</script>

<template>
  <GooseCheckbox
    v-model="store.inputs[props.name] as boolean | null"
    :disabled
    :name
  >
    <slot />
  </GooseCheckbox>
</template>
