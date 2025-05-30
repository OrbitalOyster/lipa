<script setup lang="ts">
import { arrow, autoPlacement, autoUpdate, hide, flip, offset, shift, size, useFloating } from '@floating-ui/vue'
import { computed, ref, useTemplateRef } from 'vue'
import { getOppositePlacement, getSide } from '@floating-ui/utils'
import type { Side } from '@floating-ui/core'
import { refDebounced } from '@vueuse/core'

import { useFloatingUI } from '#composables/useFloatingUI.ts'

/* Look and feel */
const debounceDelay = 1000/* ,
  minWidth = 32,
  minHeight = 32,
  arrowSize = 16
  */

const props = defineProps<{
    hasArrow?: boolean
    clickToggle?: boolean
    hoverToggle?: boolean
    side?: Side
  }>(),
  active = ref(false),
  debounced = refDebounced(active, debounceDelay),
  target = useTemplateRef('target'),
  floating = useTemplateRef('floating'),
  arrowRef = useTemplateRef('arrowRef'),
  fitTargetWidth = false

const { floatingStyles, middlewareData, arrowStyle } = 
  useFloatingUI(target, floating, arrowRef, active, props.side, props.hasArrow, fitTargetWidth)

/*
const offsetValue = props.hasArrow ? arrowSize : 8,
  placement = props.side,
  autoPlacementOptions = placement ? { allowedPlacements: [placement] } : {},
  shiftOptions = { padding: arrowSize },
  maxDistanceToEdge = 16,
  arrowOptions = { element: arrowRef, padding: arrowSize },
  fitTargetWidth = false

const { floatingStyles, isPositioned, middlewareData } = useFloating(target, floating, {
  open: active,
  placement,
  strategy: 'fixed',
  middleware: [
    offset({ mainAxis: offsetValue }),
    autoPlacement(autoPlacementOptions),
    shift(shiftOptions),
    arrow(arrowOptions),
    size({
      apply({ availableWidth, availableHeight, rects, elements }) {
        Object.assign(elements.floating.style, {
          minWidth: `${fitTargetWidth ? rects.reference.width : minWidth}px`,
          maxWidth: `${Math.max(minWidth, availableWidth - maxDistanceToEdge)}px`,
          maxHeight: `${Math.max(minHeight, availableHeight - maxDistanceToEdge)}px`,
        })
      },
    }),
    hide(),
  ],
  whileElementsMounted: autoUpdate,
})

const arrowStyle = computed(
  () => {
    const side = getSide(middlewareData.value.offset?.placement ?? 'top'),
      staticSide = getOppositePlacement(side),
      rotation = rotations[side],
      middlewareArrow = middlewareData.value.arrow
    return {
      width: `${arrowSize}px`,
      height: `${arrowSize}px`,
      transform: `rotate(${rotation}deg)`,
      top: middlewareArrow?.y != null ? `${middlewareArrow?.y}px` : '',
      left: middlewareArrow?.x != null ? `${middlewareArrow?.x}px` : '',
      [staticSide]: `-${(arrowRef.value?.offsetWidth ?? 0) / 2}px`,
    }
  })
*/

function toggle() {
  active.value = !active.value
}

defineExpose({ toggle, active })

</script>

<template>
  <!-- Target element -->
  <div
    ref="target"
    style="display: inline"
    @click="clickToggle && toggle()"
    @mouseover="hoverToggle && (active = true)"
    @mouseleave="hoverToggle && (active = false)"
  >
    <slot />
  </div>
  <!-- Pretty animation on toggle -->
  <Transition name="fade">
    <div
      v-if="debounced"
      ref="floating"
      class="floating"
      :style="{
        ...floatingStyles,
        visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible'
      }"
    >
      <!-- Arrow -->
      <div
        v-if="hasArrow"
        ref="arrowRef"
        :style="arrowStyle"
        class="arrow"
      />
      <!-- Actual popover -->
      <slot name="popover" />
    </div>
  </Transition>
</template>

<style lang="sass" scoped>
  @use '../assets/borders.sass'
  @use '../assets/colors.sass'
  /* Do not remove this line, needed for transition effect */
  @use '../assets/transitions.sass'

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
</style>
