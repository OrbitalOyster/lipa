<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['submit']),
  validated = ref(false)
</script>

<template>
  <form
    novalidate
    :class="validated ? 'validated' : 'unvalidated'"
    @submit.prevent="validated = true; emit('submit')"
  >
    <slot />
  </form>
</template>

<style lang="sass">
  @use '../assets/colors'

  /* Hide error-icon's */
  .unvalidated
    .error-icon
      display: none

  /* Validation formatting only shows up in validated elements */
  .validated
    input.valid:not(:disabled)
      background-color: colors.$input-valid-background 
      border: 1px solid colors.$input-valid-border

    input.invalid:not(:disabled)
      background-color: colors.$input-invalid-background
      border: 1px solid colors.$input-invalid-border

</style>
