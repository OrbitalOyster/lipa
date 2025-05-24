<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  disabled?: boolean
  indeterminate?: boolean
}>()

const toggled = defineModel<boolean>({ default: false }),
  id = useId()
</script>

<template>
  <div class="wrapper">
    <button
      :id
      :disabled
      :class="{ toggled, disabled, indeterminate }"
      type="button"
      @click.stop="toggled = !toggled"
    >
    </button>
    <label :for="id">
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

  /* Base */
  button
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: 1px solid colors.$input-border
    box-sizing: content-box
    cursor: pointer
    flex-shrink: 0
    height: $button-size
    outline: colors.$outline solid 0px
    padding: 0
    position: relative
    transition: transitions.$focusable, transitions.$colors
    width: $button-size

  /* On focus */
  button:focus
    @extend button
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  /* On active */
  button:active:enabled
    background-color: colors.$active

  /* On disabled */
  button:disabled
    background-color: colors.$input-disabled
    border: 1px solid colors.$input-disabled
    cursor: not-allowed

  /* Mark */
  button::after
    background-color: colors.$primary
    border-radius: borders.$radius
    content: ""
    height: $mark-size
    left: calc(($button-size - $mark-size) / 2)
    position: absolute
    scale: 0%
    top: calc(($button-size - $mark-size) / 2)
    transition: height .1s ease-in-out, top .1s ease-in-out, scale .1s ease-in-out
    width: $mark-size

  /* On toggled */
  button.toggled::after
    scale: 100%

  button.indeterminate::after
    height: $mark-indeterminate-height
    top: calc(($button-size - $mark-indeterminate-height) / 2)

  /* On disabled */
  button:disabled::after
    background-color: colors.$disabled-primary

  /* Label */
  label
    cursor: pointer
    user-select: none

  /* Label */
  button:disabled ~ label
    cursor: not-allowed
</style>
