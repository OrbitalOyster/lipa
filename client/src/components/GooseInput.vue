<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseErrorIcon from '#components/GooseErrorIcon.vue'
import GooseInputPlaceholder from '#components/GooseInputPlaceholder.vue'
import GooseTogglePassword from '#components/GooseTogglePassword.vue'
import { useFocus } from '@vueuse/core'

defineProps<{
  autocomplete?: string
  autofocus?: boolean
  disabled?: boolean
  error?: string
  icon?: object
  password?: boolean
  placeholder?: string
}>()

const text = defineModel<string>({ required: true }),
  input = useTemplateRef('input'),
  passwordHidden = ref(true),
  { focused } = useFocus(input)
</script>

<template>
  <div class="input-wrapper">
    <!-- Actual input -->
    <input
      ref="input"
      v-model="text"
      :autocomplete
      :autofocus
      :class="error ? 'invalid' : 'valid'"
      :disabled
      :type="password && passwordHidden ? 'password' : 'text'"
      :style="{ 'padding-top': placeholder ? '1.5rem' : '.25rem' }"
    >
    <!-- Placeholder -->
    <GooseInputPlaceholder
      v-if="placeholder"
      class="placeholder"
      :title="placeholder"
      :active="focused || text !== ''"
    />
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
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: 1px solid colors.$input-border
    box-sizing: border-box
    color: colors.$text
    font: inherit
    height: 3.5rem
    min-width: 3.5rem
    outline: colors.$outline solid 0px
    padding: 1.5rem .75rem 0.25rem .75rem
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

  .placeholder
    width: calc(100% - 1.5rem)

  .icons
    align-items: center
    display: flex
    gap: .25rem
    position: absolute
    right: .75rem
</style>
