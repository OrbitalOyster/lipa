<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Inputs } from '#stores/useFormStore.ts'
import { useFormStore } from '#stores/useFormStore.ts'

const props = defineProps<{
    id: string
  }>(),
  emits = defineEmits(['submit']),
  store = useFormStore(props.id),
  validated = ref(false)

function setInputs(inputs: Inputs) {
  for (const [key, value] of Object.entries(inputs))
    store.inputs[key] = value
  store.validate()
}

function onSubmit() {
  emits('submit', store.isValid() ? store.inputs : null)
  validated.value = true
}

onMounted(() => store.validate())
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
