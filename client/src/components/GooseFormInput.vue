<script setup lang="ts">
import GooseInput from '#components/GooseInput.vue'
import { computed, inject } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{
    checks?: FormCheck[]
    name: string
  }>()

const inputs: Ref<Record<string, FormInput>> | undefined = inject('inputs'),
  setFormError: ((key: string, err: string) => void) | undefined = inject('setFormError')

if (!inputs || !setFormError)
  throw new Error('Major fuck up')

const checkInput = () => {
  let result = ''

  const value = inputs.value[props.name]
  if (props.checks)
    for (let i = 0; i < props.checks.length; i++)
      switch (props.checks[i]) {
        case 'required':
          if (!value)
            result = 'Required'
          break
        case 'lessThanTo':
          if (Number(value) >= Number(inputs.value['to']))
            result = 'Must be less than to'
          break
        case 'moreThanFrom':
          if (Number(value) <= Number(inputs.value['from']))
            result = 'Must be more than from'
          break
        case 'notBogus':
          if (value === 'bogus')
            result = 'Must not be bogus'
          break
        default:
          /* Should not get here */
          throw new Error(`Invalid check: ${props.checks[i]}`)
      }
  setFormError(props.name, result)
  return result
}

const error = computed(checkInput)

// formChecks.value[props.name] = props.checks || []
</script>

<template>
  <GooseInput
    v-model="inputs[name] as string"
    :error
    :name
  />
</template>
