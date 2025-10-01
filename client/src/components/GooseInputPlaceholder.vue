<script setup lang="ts">
defineProps<{
  title: string
  active: boolean
}>()
</script>

<template>
  <label :class="{ active }">
    {{ title }}
  </label>
</template>

<style lang="sass" scoped>
  @use '../assets/transitions'
  @use '../assets/colors'

  label
    color: colors.$input-label
    left: .75rem
    line-height: 1.5rem
    overflow: hidden
    pointer-events: none
    position: absolute
    text-overflow: ellipsis
    transform-origin: left
    transition: transitions.$transform
    user-select: none
    white-space: nowrap

  .active
    transform: translateY(calc(-50%)) scale(.9)
</style>
