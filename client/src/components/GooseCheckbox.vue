<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  disabled?: boolean
  indeterminate?: boolean
}>()

const toggled = defineModel<boolean>({ required: true }),
  id = useId()
</script>

<template>
  <div class="checkbox-wrapper">
    <button
      :id
      :disabled
      :class="{ toggled, indeterminate }"
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
  @use '@/assets/borders'
  @use '@/assets/colors'
  @use '@/assets/filters'
  @use '@/assets/transitions'
  @use '@/assets/sizings'

  /* Checkbox sizings */
  $button-size: sizings.$checkbox-size
  $mark-size: sizings.$checkbox-mark-size
  $mark-indeterminate-height: .5rem

  .checkbox-wrapper
    align-items: center
    display: flex
    gap: sizings.$checkbox-gap
    width: fit-content

  button
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: borders.$form-input
    box-sizing: content-box
    cursor: pointer
    height: $button-size
    outline: colors.$outline solid 0px
    position: relative
    transition: transitions.$focusable, transitions.$colors, transitions.$filter
    width: $button-size

    &:focus
      border-color: colors.$outline
      outline-width: borders.$focus-outline-width

    &:disabled
      border-color: colors.$input-disabled
      cursor: not-allowed
      filter: filters.$disabled

    /* Mark */
    &::after
      background-color: colors.$primary
      border-radius: borders.$radius
      content: ""
      height: $mark-size
      left: calc(($button-size - $mark-size) / 2)
      position: absolute
      scale: 0%
      top: calc(($button-size - $mark-size) / 2)
      transition: transitions.$checkbox, transitions.$colors, transitions.$filter
      width: $mark-size

    &:not(:disabled):hover::after
      filter: filters.$hover

    &:not(:disabled):active::after
        filter: filters.$active

    &.toggled::after
      scale: 100%

    &.indeterminate::after
      height: $mark-indeterminate-height
      top: calc(($button-size - $mark-indeterminate-height) / 2)

  /* Label */
  label
    cursor: pointer
    user-select: none

  /* Hide empty labels */
  label:not(:has(*))
    display: none

  /* On disabled */
  button:disabled ~ label
    cursor: not-allowed
</style>
