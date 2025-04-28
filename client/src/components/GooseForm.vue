<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Ref } from 'vue'

defineProps<{
  id: string
}>()

const emits = defineEmits(['submit']),
  validated = ref(false)

const errors: Record<string, string> = {},
  inputs: Ref<Record<string, FormInput>> = ref({})

provide('inputs', inputs)
provide('setFormError', (key: string, err: string) => errors[key] = err)

function isValid() {
  return Object.values(errors).every(e => e === '')
}

function setInputs(newInputs: Record<string, FormInput>) {
  for (const [key, value] of Object.entries(newInputs))
    inputs.value[key] = value
}

function onSubmit() {
  emits('submit', isValid() ? inputs.value : null)
  validated.value = true
}

defineExpose({ setInputs })
</script>

<template>
  <form
    novalidate
    :class="{ validated }"
    @submit.prevent="onSubmit"
  >
    <slot />
  </form>
</template>
