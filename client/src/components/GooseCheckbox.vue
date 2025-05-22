<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  disabled?: boolean
  indeterminate?: boolean
}>()

const checked = defineModel<boolean>({ default: false }),
  id = useId()
</script>

<template>
  <div class="wrapper">
    <input
      v-model="checked"
      type="checkbox"
    >
    <button
      :id
      :disabled
      class="focusable form-input"
      :class="{ disabled }"
      type="button"
      @click.stop="checked = !checked"
    >
      <div
        class="mark"
        :class="{ checked, indeterminate }"
      />
    </button>
    <label
      :for="id"
      :class="{ disabled }"
    >
      <slot />
    </label>
  </div>
</template>

<style scoped lang="sass">
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  /* Checkbox sizings */
  $button-size: 2rem
  $mark-size: 1rem
  $mark-indeterminate-height: .5rem

  .wrapper
    align-items: center
    display: flex
    gap: .5rem

  input
    display: none

  button
    box-sizing: content-box
    cursor: pointer
    flex-shrink: 0
    height: $button-size
    padding: 0
    position: relative
    transition: transitions.$focusable, transitions.$colors
    width: $button-size

  button:active:enabled
    background-color: colors.$active

  .disabled
    cursor: not-allowed

  .mark
    background-color: colors.$primary
    border-radius: borders.$radius
    height: $mark-size
    left: calc(($button-size - $mark-size) / 2)
    position: absolute
    scale: 0%
    top: calc(($button-size - $mark-size) / 2)
    transition: height .1s ease-in-out, top .1s ease-in-out, scale .1s ease-in-out
    width: $mark-size

  .mark.checked
    scale: 100%

  .mark.indeterminate
    height: $mark-indeterminate-height
    top: calc(($button-size - $mark-indeterminate-height) / 2)

  button:disabled .mark
    background-color: colors.$disabled-primary

  label
    cursor: pointer
    user-select: none
</style>
