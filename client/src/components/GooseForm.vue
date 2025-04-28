<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Ref } from 'vue'

const inputs: Ref<Record<string, FormInput>> = ref({}),
  errors: Record<string, string> = {},
  emits = defineEmits(['submit']),
  validated = ref(false)

provide('inputs', inputs)
provide('setFormError', (key: string, msg: string) => errors[key] = msg)

function setInputs(newInputs: Record<string, FormInput>) {
  for (const [key, value] of Object.entries(newInputs))
    inputs.value[key] = value
}

function onSubmit() {
  const isValid = Object.values(errors).every(e => e === '')
  emits('submit', isValid ? inputs.value : null)
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
