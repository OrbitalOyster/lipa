<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{
  inputs: string[]
}>()

const inputs: Record<string, FormInput> = {},
  errors: Record<string, string> = {},
  emits = defineEmits(['submit']),
  validated = ref(false)

props.inputs.forEach(i => {inputs[i] = "boo boo boo", provide(`${i}-input`, inputs[i])})

provide('inputs', inputs)
provide('setFormError', (key: string, msg: string) => errors[key] = msg)

function setInputs(newInputs: Record<string, FormInput>) {
  for (const [key, value] of Object.entries(newInputs))
    inputs[key] = value
}

function onSubmit() {
  const isValid = Object.values(errors).every(e => e === '')
  emits('submit', isValid ? inputs : null)
  validated.value = true

  console.log(inputs)
  props.inputs.forEach(i => console.log(inputs[i]))
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
