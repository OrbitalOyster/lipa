<script setup lang="ts">
  defineProps<{
    toggled: boolean
    width: string
  }>()
</script>

<template>
  <aside :class="{ toggled }" :style="{ width: toggled ? width : '0rem' }">
    <slot name="sidebar" /> 
  </aside>
  <div class="sidebar-right-wrapper" :class="{ toggled }" :style="{ 'margin-left': toggled ? width : '0rem' }">
    <slot /> 
  </div>
</template>

<style lang="sass" scoped>
  $transition-duration: .25s
  $transition-function: ease-in-out

  aside
    background-color: salmon
    height: 100vh
    opacity: 0
    position: fixed
    transition-duration: $transition-duration
    transition-property: width, opacity
    transition-timing-function: $transition-function
    z-index: 50

  aside.toggled
    opacity: 1

  .sidebar-right-wrapper
    transition-duration: $transition-duration
    transition-property: margin-left
    transition-timing-function: $transition-function
</style>
