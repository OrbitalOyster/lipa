<template>
  <label>
    <slot />
  </label>
</template>

<style lang="sass" scoped>
  @use '../assets/transitions'
  @use '../assets/colors'

  label
    color: colors.$input-label
    left: 1rem
    pointer-events: none
    position: absolute
    transform-origin: left
    transition: transitions.$transform
    user-select: none

  /* Shrink and translate label if:
   * - input is focused
   * - placeholder not shown
   * - input is not empty */
  * [placeholder]:focus + label,
  * [placeholder]:not(:placeholder-shown) + label,
  * :not(:empty) + label
    transform: translateY(calc(-70%)) scale(.9)
</style>
