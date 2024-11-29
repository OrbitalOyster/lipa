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
  <label> {{ title }}
    <input
      v-model="store.inputs[props.name]"
      type="checkbox"
      :name
    >
    <span class="checkmark" />
  </label>
</template>

<style scoped>

label {
  @apply relative pl-8 select-none cursor-pointer;
}

.checkmark {
  /* Border */
  @apply border border-slate-300 rounded;
  /* Sizing */
  @apply absolute inset-0 w-6 h-6;
  /* Colors */
  @apply bg-slate-50;
  /* Animation */
  @apply transition duration-200 ease-in-out;
}

.checkmark:hover {
  @apply hover:border-slate-400;
}

.checkmark:after {
  @apply absolute hidden content-none;
  content: "";
  @apply inset-1.5 w-3 h-3 rounded bg-white;
}

/* Hide actual checkbox */
input {
  @apply absolute opacity-0 w-0 h-0;
}

/* On focus */
input:focus ~ .checkmark {
  @apply ring-2 ring-offset-2 ring-emerald-400;
}

/* On active */
label input:active ~ .checkmark {
  @apply bg-emerald-700 border-0;
}

/* On checked - box */
input:checked ~ .checkmark {
  @apply bg-emerald-500 border-0;
}

/* On checked - mark */
input:checked ~ .checkmark:after {
  display: block;
}

</style>
