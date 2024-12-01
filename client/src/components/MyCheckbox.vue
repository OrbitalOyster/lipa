<script setup lang="ts">
import { computed } from 'vue'
import type { MyFormCheck } from '@stores/formStore.ts'
import { useFormStore } from '@stores/formStore.ts'

const props = defineProps<{
    name: string
    title: string
    storeId: string
    checks?: MyFormCheck[]
  }>(),
  store = useFormStore(props.storeId),
  toggle = () => {
    console.log('Ok')
    store.inputs[props.name] = !store.inputs[props.name]
  },
  isToggled = computed(() => store.inputs[props.name])

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
  <button type="button" class="foo relative form-input focusable transition" @click="toggle">
    <div v-if="isToggled" class="block absolute inset-1.5 w-2.5 h-2.5 rounded bg-emerald-500"/>
    <p class="pl-8 select-none cursor-pointer"> {{ title }} </p>
  </button>
</template>

<style scoped>

.foo {
  @apply w-6 h-6 cursor-pointer;
  content: "";
}

.foo:active {
  @apply bg-emerald-500;
}

</style>
