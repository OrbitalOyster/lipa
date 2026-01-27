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
  @use '@/assets/borders'
  @use '@/assets/colors'
  @use '@/assets/filters'
  @use '@/assets/sizings'
  @use '@/assets/transitions'

  $width: sizings.$switch-width
  $height: sizings.$switch-height
  $mark-size: sizings.$switch-mark-size

  .switch-wrapper
    align-items: center
    display: flex
    gap: sizings.$switch-gap

  button
    background-color: colors.$input-background
    border-radius: borders.$switch-border-radius
    border: borders.$form-input
    box-sizing: content-box
    cursor: pointer
    height: sizings.$switch-height
    min-width: sizings.$switch-width
    outline: colors.$outline solid 0px
    position: relative
    transition: transitions.$focusable, transitions.$colors, transitions.$filter

    &:focus
      border-color: colors.$outline
      outline-width: borders.$focus-outline-width

    &:disabled
      border-color: colors.$input-disabled
      cursor: not-allowed
      filter: filters.$disabled

    /* Mark */
    &::after
      background-color: colors.$toggled-off
      border-radius: borders.$switch-border-radius
      content: ""
      height: $mark-size
      left: calc($height / 2 - $mark-size / 2)
      position: absolute
      top: calc($height / 2 - $mark-size / 2)
      transition: transitions.$left, transitions.$filter
      width: $mark-size

    &:hover::after
      filter: filters.$hover

    &:active::after
      filter: filters.$active

    &:disabled::after
      filter: filters.$disabled

    /* Toggled mark */
    &.toggled::after
      background-color: colors.$primary
      left: calc($width - $height / 2 - $mark-size / 2)

  label
    cursor: pointer
    user-select: none

  button:disabled ~ label
    cursor: not-allowed
</style>
