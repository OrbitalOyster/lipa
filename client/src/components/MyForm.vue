<script setup lang="ts">
import type InputText from './InputText.vue'

import { useFormStore } from '../stores/formStore.ts'

const emits = defineEmits(['submit'])

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const store = useFormStore(props.id)

// eslint-disable-next-line no-useless-assignment
const onSubmit = () => {
  store.validate()
  if (Object.values(store.errors).every(e => e === '')) {
    console.log("Form validation success")
    emits('submit', store.inputs)
  }
  else {
    console.log("Form validation failed")
    emits('submit', null)
  }
}

</script>

<template>
  <form novalidate @submit.prevent="onSubmit" >
    <slot />
  </form>
</template>
