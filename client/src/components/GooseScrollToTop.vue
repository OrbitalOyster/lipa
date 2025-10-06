<script setup lang="ts">
import GooseButton from '#components/GooseButton.vue'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll(),
  threshold = 64
</script>

<template>
  <Transition name="fade">
    <div
      v-if="y > threshold"
      class="scroll-to-to-top-wrapper"
    >
      <GooseButton
        :icon="faChevronUp"
        tooltip="Вернуться наверх"
        round
        @click="y = 0"
      />
    </div>
  </Transition>
</template>

<style lang="sass">
  /* Do not remove this line, needed for transition effect */
  @use '../assets/transitions.sass'

  .scroll-to-to-top-wrapper
    bottom: 2rem
    position: fixed
    right: 2rem

  html
    scroll-behavior: smooth
</style>
