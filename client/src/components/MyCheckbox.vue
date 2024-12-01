<script setup lang="ts">
import type { MyFormCheck } from '@stores/formStore.ts'
import { useFormStore } from '@stores/formStore.ts'

const props = defineProps<{
    name: string
    title: string
    storeId: string
    checks?: MyFormCheck[]
  }>(),
  store = useFormStore(props.storeId)

store.checks[props.name] = props.checks ?? []
store.inputs[props.name] = false
</script>

<template>
  <label class="relative pl-8 select-none cursor-pointer"> {{ title }}
    <input
      v-model="store.inputs[props.name]"
      class="absolute opacity-0 w-0 h-0"
      type="checkbox"
      :name
    >
    <span class="checkmark absolute inset-0 w-6 h-6 border-0 form-input transition" />
  </label>
</template>

<style scoped>

.checkmark::after {
  @apply content-none;
}

/* On focus */
input:focus ~ .checkmark {
  @apply ring-4 ring-emerald-400;
}

/* On active */
input:active ~ .checkmark {
  @apply bg-emerald-700;
}

/* On checked - box */
input:checked ~ .checkmark {
  @apply bg-emerald-500;
}

/* On checked - mark */
input:checked ~ .checkmark::after {
  @apply block absolute inset-1.5 w-2.5 h-2.5 rounded bg-white;
  content: "";
}

</style>
