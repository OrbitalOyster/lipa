<script setup lang="ts">
import GooseInput from '#components/GooseInput.vue'
import { useFormStore } from '#stores/useFormStore.ts'

const props = defineProps<{
    autocomplete?: string
    autofocus?: boolean
    checks?: FormCheck[]
    disabled?: boolean
    form: string
    name: string
    password?: boolean
    placeholder?: string
  }>(),
  store = useFormStore(props.form)

/* Init store */
store.inputs[props.name] = store.inputs[props.name] ?? ''
store.checks[props.name] = props.checks ?? []
</script>

<template>
  <GooseInput
    v-model="store.inputs[props.name] as string"
    :autocomplete
    :autofocus
    :disabled
    :error="store.errors[props.name]"
    :name
    :password
    :placeholder
    :validity="store.errors[props.name] ? 'invalid' : 'valid'"
    @input="store.validate"
  />
</template>
