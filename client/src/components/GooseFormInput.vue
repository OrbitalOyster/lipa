<script setup lang="ts">
import GooseInput from '#components/GooseInput.vue'
import { ref } from 'vue'

const messages = {
  required: 'Обязательное поле',
  notBogus: 'bogus',
}

const props = defineProps<{
    checks?: FormCheck[]
  }>(),
  text = defineModel<string>({ default: '' }),
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

defineExpose({ error })
</script>

<template>
  <GooseInput
    v-model="text"
    :error="validate()"
  />
</template>
