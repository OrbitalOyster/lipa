<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFormStore } from '@stores/formStore.ts'

const emits = defineEmits(['submit']),
  props = defineProps<{
    id: string
  }>(),
  store = useFormStore(props.id),
  validated = ref(''),
  // eslint-disable-next-line no-useless-assignment
  onSubmit = () => {
    if (store.isValid()) {
      emits('submit', store.inputs)
    }
    else {
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
    @submit.prevent="onSubmit"
  >
    <slot />
  </form>
</template>
