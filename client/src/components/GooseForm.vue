<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

const emit = defineEmits(['submit']),
  validated = ref(false),
  form = useTemplateRef('form')

function focusInvalidInput() {
  const invalid = form.value?.querySelector('.invalid') as HTMLElement
  invalid?.focus()
}

function submit() {
  validated.value = true
  emit('submit')
  focusInvalidInput()
}
</script>

<template>
  <form
    ref="form"
    novalidate
    :class="validated ? 'validated' : 'unvalidated'"
    @submit.prevent="submit"
  >
    <slot />
  </form>
</template>

<style lang="sass">
  /* Rare non-scoped style block */
  @use '../assets/colors'

  /* Hide error icons */
  .unvalidated
    .error-icon
      display: none

  /* Validation formatting only shows up in validated elements */
  .validated
    .valid:not(:disabled)
      background-color: colors.$input-valid-background
      border: 1px solid colors.$input-valid-border

    .invalid:not(:disabled)
      background-color: colors.$input-invalid-background
      border: 1px solid colors.$input-invalid-border
</style>
