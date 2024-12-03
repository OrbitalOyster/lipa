<script setup lang="ts">
import type { MyFormCheck } from '@stores/formStore.ts'
import { useFormStore } from '@stores/formStore.ts'

const props = defineProps<{
    name: string
    title: string
    disabled?: boolean
    storeId: string
    checks?: MyFormCheck[]
  }>(),
  store = useFormStore(props.storeId),
  // eslint-disable-next-line no-useless-assignment
  toggle = () => { store.inputs[props.name] = !store.inputs[props.name] }

store.checks[props.name] = props.checks ?? []
store.inputs[props.name] = false
</script>

<template>
  <input
    v-model="store.inputs[props.name]"
    class="hidden"
    type="checkbox"
    :name
  >
  <div class="flex space-x-2">
    <button
      :id="`${storeId}-${props.name}`"
      type="button"
      :disabled
      class="w-6 h-6 cursor-pointer relative form-input focusable transition active:bg-emerald-500"
      @click="toggle"
    >
      <div
        v-if="store.inputs[props.name]"
        class="block absolute inset-1 w-3.5 h-3.5 rounded bg-emerald-500"
      />
    </button>
    <label
      class="select-none cursor-pointer"
      :for="`${storeId}-${props.name}`"
    >
      {{ title }}
    </label>
  </div>
</template>

<style scoped>
  button:disabled + label {
    pointer-events: none;
  }
</style>
