<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseErrorIcon from '#components/GooseErrorIcon.vue'
import GooseTogglePassword from '#components/GooseTogglePassword.vue'
import { ref } from 'vue'

defineProps<{
  autocomplete?: string
  autofocus?: boolean
  disabled?: boolean
  error?: string
  icon?: object
  name?: string
  password?: boolean
  placeholder?: string
  validity?: FormInputValidity
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
      class="focusable form-input"
      :class="[validity]"
      :disabled
      :name
      :placeholder
      :type="password && passwordHidden ? 'password' : 'text'"
    >
    <label
      v-if="placeholder"
      class="shrinkable"
    >
      {{ placeholder }}
    </label>
    <div class="icons">
      <GooseErrorIcon
        :message="error"
      />
      <!-- Validation error icon -->
      <!--
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
      -->
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

  .icons
    align-items: center
    display: flex
    position: absolute
    right: .5rem
</style>
