<script setup lang="ts">
import GooseInput from '#components/GooseInput.vue'

const props = defineProps<{
    checks?: FormCheck[]
  }>(),
  emit = defineEmits(['validated']),
  model = defineModel<string>({ default: '' })

function validate(value: string) {
  let result = ''
  if (props.checks)
    for (const check of props.checks)
      switch (check) {
        case 'required':
          if (!value)
            result = 'Required'
          break
        case 'notBogus':
          if (value === 'bogus')
            result = 'Must not be bogus'
          break
      }
  emit('validated', result)
  return result
}

</script>

<template>
  <GooseInput
    v-model="model"
    :error="validate(model)"
  />
</template>
