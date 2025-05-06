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
  password?: boolean
  placeholder?: string
}>()

const model = defineModel<string>({ default: '' }),
  passwordHidden = ref(true)
</script>

<template>
  <div style="align-items: center; display: flex; position: relative">
    <!-- Actual input -->
    <input
      v-model="model"
      :autocomplete
      :autofocus
      class="focusable form-input"
      :class="error ? 'invalid' : 'valid'"
      :disabled
      :placeholder
      :type="password && passwordHidden ? 'password' : 'text'"
    >
    <!-- Placeholde -->
    <label
      v-if="placeholder"
      class="shrinkable"
    >
      {{ placeholder }}
    </label>
    <div class="icons">
      <!-- Validation icon -->
      <GooseErrorIcon
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
    gap: .25rem
    position: absolute
    right: .5rem
</style>
