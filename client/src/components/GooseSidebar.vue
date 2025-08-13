<script setup lang="ts">
defineProps<{
  toggled: boolean
  width: string
}>()
</script>

<template>
  <aside
    :class="{ toggled }"
    :style="{ width, transform: toggled ? 'scaleX(1)' : 'scaleX(0)' }"
  >
    <slot name="sidebar" />
  </aside>
  <div
    class="sidebar-right-wrapper"
    :class="{ toggled }"
    :style="{ 'margin-left': toggled ? width : '0rem' }"
  >
    <slot />
  </div>
</template>

<style lang="sass" scoped>
  $transition-duration: .2s
  $transition-function: ease-in-out

  aside
    height: 100vh
    opacity: 0
    position: fixed
    transform-origin: left
    transition-duration: $transition-duration
    transition-property: width, opacity, transform
    transition-timing-function: $transition-function

  aside.toggled
    opacity: 1

  .sidebar-right-wrapper
    transition-duration: $transition-duration
    transition-property: margin-left
    transition-timing-function: $transition-function
</style>
