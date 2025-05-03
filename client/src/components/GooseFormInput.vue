<script setup lang="ts">
import { computed, inject } from 'vue'
import GooseInput from '#components/GooseInput.vue'
import type { Ref } from 'vue'

const props = defineProps<{
  checks?: FormCheck[]
}>()

const model = defineModel<string>(),
  error = validate()

function validate() {
console.log('validating...', model.value)
  const value = model.value
  let result = ''
  if (props.checks)
    for (const check of props.checks)
      switch (check) {
        case 'required':
          if (!value)
            result = 'Required'
          break
        case 'lessThanTo':
          if (Number(value) >= Number(inputs['to']))
            result = 'Must be less than to'
          break
        case 'moreThanFrom':
          if (Number(value) <= Number(inputs['from']))
            result = 'Must be more than from'
          break
        case 'notBogus':
          if (value === 'bogus')
            result = 'Must not be bogus'
          break
      }
  return result
}

defineExpose({error})
</script>

<template>
  <GooseInput
    v-model="model"
    @input="async e => {await $nextTick(); error = validate()}"
    :error
  />
</template>
