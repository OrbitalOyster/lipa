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
  <div class="checkbox-wrapper">
    <button
      :id
      :disabled
      :class="{ toggled, disabled, indeterminate }"
      type="button"
      @click="toggled = !toggled"
    />
    <!-- preventDefault() to keep focus on button -->
    <label
      :for="id"
      @mousedown.prevent
    >
      <slot />
    </label>
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  /* Checkbox sizings */
  $button-size: 2rem
  $mark-size: 1rem
  $mark-indeterminate-height: .5rem

  .checkbox-wrapper
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
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  /* On active */
  button:active
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
    filter: drop-shadow(colors.$button-shadow 0 .1rem .1rem)
    height: $mark-size
    left: calc(($button-size - $mark-size) / 2)
    position: absolute
    scale: 0%
    top: calc(($button-size - $mark-size) / 2)
    transform: translateY(-.0625rem)
    transition: scale transitions.$time transitions.$function, transitions.$focusable, transitions.$colors, transitions.$filter
    width: $mark-size

  /* On hover */
  button:hover::after
    filter: drop-shadow(colors.$button-shadow 0 .2rem .2rem)

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
