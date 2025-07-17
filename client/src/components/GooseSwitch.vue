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
      :class="{ toggled }"
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

  $height: 2rem
  $width: 3rem
  $mark-size: 1.5rem

  .switch-wrapper
    align-items: center
    display: flex
    gap: .5rem

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
    min-width: $width

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
    filter: drop-shadow(colors.$button-shadow 0 .1rem .1rem)
    height: $mark-size
    left: calc($height / 2 - $mark-size / 2)
    position: absolute
    top: calc($height / 2 - $mark-size / 2)
    transform: translateY(-.0625rem)
    transition: left transitions.$time transitions.$function, transitions.$focusable, transitions.$colors, transitions.$filter
    width: $mark-size

  /* On toggled */
  button.toggled::after
    background-color: colors.$primary
    left: calc($width - $height / 2 - $mark-size / 2)

  /* On hover */
  button:not(:disabled):hover::after
    filter: drop-shadow(colors.$button-shadow 0 .2rem .2rem)

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
