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
    left: 1rem
    line-height: 1.25rem
    overflow: hidden
    pointer-events: none
    position: absolute
    text-overflow: ellipsis
    transform-origin: left
    transition: transitions.$transform
    user-select: none

  .active
    transform: translateY(calc(-70%)) scale(.9)
</style>
