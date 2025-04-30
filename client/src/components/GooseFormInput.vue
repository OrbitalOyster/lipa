<script setup lang="ts">
import { computed, inject } from 'vue'
import GooseInput from '#components/GooseInput.vue'
import type { Ref } from 'vue'

const props = defineProps<{
  checks?: FormCheck[]
  name: string
}>()

const inputs: Record<string, FormInput> | undefined = inject('inputs'),
  setFormError: ((key: string, err: string) => void) | undefined = inject('setFormError')

let myInput = inject(`${props.name}-input`)
console.log(myInput)

if (!inputs || !setFormError)
  throw new Error('Major fuck up')

const checkInput = () => {
  let result = ''
  const value = inputs[props.name]
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
  setFormError(props.name, result)
  return result
}

const error = computed(checkInput)
</script>

<template>
  <GooseInput
    v-model="myInput"
    :error
    :name
  />
</template>
