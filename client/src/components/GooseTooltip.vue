<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { Side } from '@floating-ui/core'
import { refDebounced } from '@vueuse/core'
import { useFloatingUI } from '#composables/useFloatingUI.ts'

const props = defineProps<{
  side?: Side
  text?: string
}>(),
  active = ref(false),
  debounceDelay = 1500,
  debounced = refDebounced(active, debounceDelay),
  target = useTemplateRef('target'),
  floating = useTemplateRef('floating'),
  arrow = useTemplateRef('arrow')

const { floatingStyles, middlewareData, arrowStyle }
  = useFloatingUI(target, floating, arrow, { active, side: props.side, useArrow: true })
</script>

<template>
  <!-- Target element -->
  <div
    ref="target"
    @mouseover="active = true"
    @mouseleave="active = false"
  >
    <slot />
  </div>
  <!-- Pretty animation on toggle -->
  <Transition name="fade">
    <div
      v-show="text && debounced && !middlewareData.hide?.referenceHidden"
      ref="floating"
      class="floating"
      :style="{ ...floatingStyles }"
    >
      <!-- Arrow -->
      <div
        ref="arrow"
        :style="arrowStyle"
        class="arrow"
      />
      <!-- Actual tooltip -->
      <div class="tooltip">
        {{ text }}
      </div>
    </div>
  </Transition>
</template>

<style lang="sass" scoped>
  @use '../assets/borders.sass'
  @use '../assets/colors.sass'
  /* Do not remove this line, needed for transition effect */
  @use '../assets/transitions.sass'

  span
    display: inline-block
    width: fit-content
    height: fit-content

  .arrow
    background-color: colors.$info
    border: 1px solid colors.$info-border
    clip-path: polygon(0% 0%, 100% 0%, 0% 100%, 0% 0%)
    color: colors.$info-text
    position: absolute

  .floating
    background-color: colors.$info
    border-radius: borders.$radius
    border: 1px solid colors.$info-border
    color: colors.$info-text
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)
    left: 0
    margin-bottom: .25rem
    position: absolute
    top: 0
    width: max-content
    z-index: 99

  .tooltip
    padding: 1rem
    white-space: nowrap
</style>
