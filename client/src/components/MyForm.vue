<script setup lang="ts">
import type InputText from './InputText.vue'
import { useFormStore } from '../stores/formStore.ts'
import { ref, onMounted } from 'vue'

const emits = defineEmits(['submit'])

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const store = useFormStore(props.id)
const validated = ref('')

// eslint-disable-next-line no-useless-assignment
const onSubmit = () => {
  if (Object.values(store.errors).every(e => e === '')) {
    console.log("Form validation success")
    emits('submit', store.inputs)
  }
  else {
    console.log("Form validation failed")
    emits('submit', null)
  }
  validated.value = 'validated'
}

onMounted(() => {
  store.validate()
})

</script>

<template>
  <form novalidate @submit.prevent="onSubmit" :class="validated">
    <slot />
  </form>
</template>
