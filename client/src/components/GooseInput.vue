<script setup lang="ts">
import { faEye, faEyeSlash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import GoosePopover from '#components/GoosePopover.vue'
import { ref } from 'vue'

type Validity = 'valid' | 'invalid'

defineProps<{
  autocomplete?: string
  autofocus?: boolean
  disabled?: boolean
  error?: string
  icon?: object
  name?: string
  password?: boolean
  placeholder?: string
  validity?: Validity
}>()

const model = defineModel<string>({ default: '' }),
  passwordHidden = ref(true)
</script>

<template>
  <div style="align-items: center; display: flex; position: relative">
    <input
      v-model="model"
      :autocomplete
      :autofocus
      :class="['focusable', 'form-input', validity]"
      :disabled
      :name
      :placeholder
      :type="password && passwordHidden ? 'password' : 'text'"
    >
    <label v-if="placeholder">
      {{ placeholder }}
    </label>
    <div class="icons">
      <!-- Validation error icon -->
      <GoosePopover
        has-arrow
        hover-toggle
      >
        <div
          v-if="validity === 'invalid'"
          class="alert-icon"
        >
          <FontAwesomeIcon
            :icon="faTriangleExclamation"
            size="xl"
          />
        </div>
        <template #popover>
          <p class="validation-message">
            {{ error }}
          </p>
        </template>
      </GoosePopover>
      <!-- Custom icon -->
      <FontAwesomeIcon
        v-if="icon"
        :icon="icon"
        size="lg"
      />
      <!-- Password show/hide icon -->
      <GooseButton
        v-if="password"
        transparent
        tooltip="Показать/скрыть пароль"
        :disabled
        :icon="passwordHidden ? faEye : faEyeSlash"
        @click="passwordHidden = !passwordHidden"
      />
    </div>
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'
  @use '../assets/transitions'

  input
    color: colors.$text
    height: 2rem
    padding: .25rem 1rem .25rem 1rem
    transition: transitions.$focusable, transitions.$colors
    width: 100%

  input:disabled
    color: colors.$disabled-primary
    cursor: not-allowed

  input[placeholder]
    padding-top: 1.5rem

  input::placeholder
    opacity: 0

  /* Shrinkable label */
  label
    color: colors.$input-label
    left: 1rem
    pointer-events: none
    position: absolute
    transform-origin: left
    transition: transitions.$transform
    user-select: none

  /* Shrink and translate label if:
   * - input is focused
   * - placeholder not shown
   * - input is not empty */
  input[placeholder]:focus + label,
  input[placeholder]:not(:placeholder-shown) + label,
  input:not(:empty) + label
    transform: translateY(calc(-70%)) scale(.9)

  .icons
    align-items: center
    display: flex
    position: absolute
    right: .5rem

  .validation-message
    padding: .5rem
    margin: .5rem
</style>
