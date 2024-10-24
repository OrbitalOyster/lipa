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
    emits('submit', store.myInputs)
  }
  else
    console.log("Form validation failed")
}

</script>

<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <h1>Form</h1>
    <slot />
    <button
      type="button"
      @click="reset"
    >
      Сброс
    </button>
  </form>
</template>
