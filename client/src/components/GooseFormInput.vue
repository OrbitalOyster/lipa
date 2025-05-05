<script setup lang="ts">
import { ref, watch } from 'vue'
import GooseInput from '#components/GooseInput.vue'

const props = defineProps<{
    checks?: FormCheck[]
  }>(),
  model = defineModel<string>({ default: '' }),
  error = ref(validate(model.value))

watch(model, (newValue) => {
  error.value = validate(newValue)
})

defineExpose({ error })

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
  return result
}

</script>

<template>
  <GooseInput
    v-model="model"
    :error
  />
</template>
