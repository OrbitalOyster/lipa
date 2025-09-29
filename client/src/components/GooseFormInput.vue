<script setup lang="ts">
import GooseInput from '#components/GooseInput.vue'
import GooseSelect from '#components/GooseSelect.vue'
import { ref } from 'vue'

const messages = {
  required: 'Обязательное поле',
  notBogus: 'bogus',
}

const props = defineProps<{
    tag: 'input' | 'select'
    checks?: FormCheck[]
  }>(),
  text = defineModel<string>({ required: true }),
  error = ref('')

function validate() {
  error.value = ''
  if (props.checks)
    for (const check of props.checks)
      switch (check) {
        case 'required':
          if (!text.value)
            error.value = messages.required
          break
        case 'notBogus':
          if (text.value === 'bogus')
            error.value = messages.notBogus
          break
      }
  return error.value
}

function tagToComponent() {
  switch (props.tag) {
    case 'input':
      return GooseInput
    case 'select':
      return GooseSelect
    default:
      throw new Error('Major screwup')
  }
}

defineExpose({ error })
</script>

<template>
  <component
    :is="tagToComponent()"
    v-model="text"
    :error="validate()"
  />
</template>
