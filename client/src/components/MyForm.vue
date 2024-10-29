<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFormStore } from '../stores/formStore.ts'

const emits = defineEmits(['submit']),
  props = defineProps({
    id: {
      type: String,
      required: true,
    },
  }),
  store = useFormStore(props.id),
  validated = ref(''),
  // eslint-disable-next-line no-useless-assignment
  onSubmit = () => {
  console.log('Form submit')
    if (Object.values(store.errors).every(e => e === '')) {
      console.log('Form validation success')
      emits('submit', store.inputs)
    }
    else {
      console.log('Form validation failed')
      emits('submit', null)
    }
    validated.value = 'validated'
  }

onMounted(() => {
  store.validate()
})

</script>

<template>
  <form
    novalidate
    :class="validated"
    @submit.prevent="console.log(123); onSubmit()"
  >
    <slot />
  </form>
</template>
