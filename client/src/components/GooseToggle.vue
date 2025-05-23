<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  disabled?: boolean
}>()

const checked = defineModel<boolean>({ default: false }),
  id = useId()
</script>

<template>
  <div class="wrapper">
    <input type="checkbox" :checked>
    <button
      :id
      :disabled
      type="button"
      class="focusable form-input"
      @click="checked = !checked"
    >
      <div 
        class="mark"
        :class="{ checked }"
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

  $toggle-height: 2rem
  $toggle-width: 3rem
  $mark-size: 1.5rem

  .wrapper
    align-items: center
    display: flex
    gap: .5rem

  input
    display: none

  button
    border-radius: 1rem
    box-sizing: content-box
    cursor: pointer
    height: $toggle-height
    padding: 0
    position: relative
    transition: transitions.$focusable, transitions.$colors
    width: $toggle-width

  button:active:enabled
    background-color: colors.$active

  .mark
    border-radius: 1rem
    height: $mark-size
    position: absolute
    top: calc($toggle-height / 2 - $mark-size / 2)
    transition: left transitions.$time transitions.$function
    width: $mark-size

  .mark.checked
    background-color: colors.$primary
    left: calc($toggle-width - $toggle-height / 2 - $mark-size / 2)

  .mark:not(.checked)
    background-color: colors.$disabled
    left: calc($toggle-height / 2 - $mark-size / 2)

  button:disabled .mark
    background-color: colors.$disabled-primary

  label
    cursor: pointer
    user-select: none
</style>
