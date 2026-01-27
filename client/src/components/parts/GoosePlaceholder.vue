<script setup lang="ts">
defineProps<{
  active: boolean
  title: string
}>()
</script>

<template>
  <label :class="{ active }">
    {{ title }}
  </label>
</template>

<style lang="sass" scoped>
  @use '@/assets/borders'
  @use '@/assets/colors'
  @use '@/assets/sizings'
  @use '@/assets/transitions'

  label
    color: colors.$input-label
    left: calc(sizings.$padding + borders.$form-input-width)
    overflow: hidden
    pointer-events: none
    position: absolute
    text-overflow: ellipsis
    transform-origin: left
    transition: transitions.$transform
    user-select: none
    white-space: nowrap

    &.active
      transform: sizings.$placeholder-transform
</style>
