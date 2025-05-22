<script setup lang="ts">
const checked = defineModel<boolean>({ default: false })
</script>

<template>
  <div class="wrapper">
    <input type="checkbox" :checked>
    <button
      type="button"
      class="focusable form-input"
      @click="checked = !checked"
    >
      <div 
        class="mark"
        :class="{ checked }"
      />
    </button>

  </div>
</template>

<style scoped lang="sass">
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  $toggle-height: 2rem
  $toggle-width: 3rem
  $mark-size: 1.5rem

  input
    display: none

  button
    padding: 0
    box-sizing: content-box
    width: $toggle-width
    height: $toggle-height
    border-radius: 1rem
    position: relative
    transition: transitions.$focusable, transitions.$colors

  .mark
    top: calc($toggle-height / 2 - $mark-size / 2)
    width: $mark-size
    height: $mark-size
    border-radius: 1rem
    position: absolute
    transition: left transitions.$time transitions.$function

  .mark.checked
    background-color: colors.$primary
    left: calc($toggle-width - $toggle-height / 2 - $mark-size / 2)

  .mark:not(.checked)
    background-color: colors.$disabled
    left: calc($toggle-height / 2 - $mark-size / 2)
    
</style>
