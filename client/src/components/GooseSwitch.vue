<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  disabled?: boolean
}>()

const toggled = defineModel<boolean>({ default: false }),
  id = useId()
</script>

<template>
  <div class="switch-wrapper">
    <button
      :id
      :disabled
      type="button"
      :class="{ toggled }"
      @click="toggled = !toggled"
    />
    <!-- preventDefault() to keep focus on button -->
    <label
      :for="id"
      @mousedown="e => e.preventDefault()"
    >
      <slot />
    </label>
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  $height: 2rem
  $width: 3rem
  $mark-size: 1.5rem

  .switch-wrapper
    align-items: center
    display: flex
    gap: .5rem

  input
    display: none

  /* Base */
  button
    background-color: colors.$input-background
    border-radius: 1rem
    border: 1px solid colors.$input-border
    box-sizing: content-box
    cursor: pointer
    height: $height
    outline: colors.$outline solid 0px
    padding: 0
    position: relative
    transition: transitions.$focusable, transitions.$colors
    width: $width

  /* On focus */
  button:focus
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  /* On disabled */
  button:disabled
    background-color: colors.$input-disabled
    border: 1px solid colors.$input-disabled
    cursor: not-allowed

  /* Mark */
  button::after
    background-color: colors.$disabled
    border-radius: 1rem
    content: ""
    height: $mark-size
    left: calc($height / 2 - $mark-size / 2)
    position: absolute
    top: calc($height / 2 - $mark-size / 2)
    transition: left transitions.$time transitions.$function
    width: $mark-size

  /* On toggled */
  button.toggled::after
    background-color: colors.$primary
    left: calc($width - $height / 2 - $mark-size / 2)

  /* On active */
  button:active::after
    background-color: colors.$active

  /* On disabled */
  button:disabled::after
    background-color: colors.$disabled-primary

  /* Label */
  label
    cursor: pointer
    user-select: none

  button:disabled ~ label
    cursor: not-allowed

</style>
