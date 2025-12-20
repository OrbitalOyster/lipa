<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  disabled?: boolean
}>()

const toggled = defineModel<boolean>({ required: true }),
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
    min-width: $width
    outline: colors.$outline solid 0px
    padding: 0
    position: relative
    transition: transitions.$focusable, transitions.$filter

  /* On hover */
  button:hover:not(:disabled)::after
    filter: brightness(1.1)

  /* On focus */
  button:focus
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  /* On active */
  button:not(:disabled):active::after
    filter: brightness(.9)

  /* On disabled */
  button:disabled
    border: 1px solid colors.$input-disabled
    cursor: not-allowed
    filter: grayscale(.9) brightness(.9)

  /* Mark */
  button::after
    background-color: colors.$toggled-off
    border-radius: 1rem
    content: ""
    height: $mark-size
    left: calc($height / 2 - $mark-size / 2)
    position: absolute
    top: calc($height / 2 - $mark-size / 2)
    transition: left transitions.$time transitions.$function, transitions.$focusable, transitions.$filter
    width: $mark-size

  /* On toggled */
  button.toggled::after
    background-color: colors.$primary
    left: calc($width - $height / 2 - $mark-size / 2)

  /* Label */
  label
    cursor: pointer
    user-select: none

  button:disabled ~ label
    cursor: not-allowed
</style>
