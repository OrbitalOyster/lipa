<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseErrorIcon from '#components/GooseErrorIcon.vue'
import GooseInputPlaceholder from '#components/GooseInputPlaceholder.vue'
import GooseTogglePassword from '#components/GooseTogglePassword.vue'
import { ref } from 'vue'

defineProps<{
  autocomplete?: string
  autofocus?: boolean
  disabled?: boolean
  error?: string
  icon?: object
  password?: boolean
  placeholder?: string
}>()

const text = defineModel<string>({ default: '' }),
  passwordHidden = ref(true)
</script>

<template>
  <div class="input-wrapper">
    <!-- Actual input -->
    <input
      v-model="text"
      :autocomplete
      :autofocus
      :class="error ? 'invalid' : 'valid'"
      :disabled
      :placeholder
      :type="password && passwordHidden ? 'password' : 'text'"
    >
    <!-- Placeholder -->
    <GooseInputPlaceholder v-if="placeholder">
      {{ placeholder }}
    </GooseInputPlaceholder>
    <div class="icons">
      <!-- Validation icon -->
      <GooseErrorIcon
        v-if="error"
        :message="error"
      />
      <!-- Custom icon -->
      <FontAwesomeIcon
        v-if="icon"
        :icon="icon"
        size="lg"
      />
      <!-- Password show/hide icon -->
      <GooseTogglePassword
        v-if="password"
        v-model="passwordHidden"
        :disabled
      />
    </div>
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  .input-wrapper
    align-items: center
    display: flex
    position: relative

  /* Base */
  input
    font: inherit
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: 1px solid colors.$input-border
    color: colors.$text
    height: 2rem
    outline: colors.$outline solid 0px
    padding: .25rem 1rem .25rem 1rem
    transition: transitions.$focusable, transitions.$colors
    width: 100%

  /* On focus */
  input:focus
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  /* On disabled */
  input:disabled
    background-color: colors.$input-disabled
    border-color: colors.$input-disabled
    color: colors.$disabled-primary
    cursor: not-allowed

  input[placeholder]
    padding-top: 1.5rem

  input::placeholder
    opacity: 0

  .icons
    align-items: center
    display: flex
    gap: .25rem
    position: absolute
    right: .75rem
</style>
