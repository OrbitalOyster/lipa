<script setup lang="ts">
import { arrow, autoPlacement, autoUpdate, hide, offset, shift, size, useFloating } from '@floating-ui/vue'
import { computed, ref, useTemplateRef } from 'vue'
import { getOppositePlacement, getSide } from '@floating-ui/utils'
import type { Side } from '@floating-ui/core'
import { refDebounced } from '@vueuse/core'

import { foo } from '#composables/useFloatingUI.ts'
foo()

/* Look and feel */
const debounceDelay = 1000,
  minSize = 256,
  arrowSize = 16,
  rotations = {
    top: -135,
    right: -45,
    bottom: 45,
    left: 135,
  }

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
  arrowRef = useTemplateRef('arrowRef')

const offsetValue = props.hasArrow ? arrowSize : 2,
  autoPlacementOptions = props.side ? { allowedPlacements: [props.side] } : {},
  shiftOptions = { padding: arrowSize },
  arrowOptions = { element: arrowRef, padding: arrowSize }

/* Floating UI */
const { floatingStyles, middlewareData } = useFloating(target, floating, {
  open: active,
  placement: props.side,
  strategy: 'fixed',
  middleware: [
    offset({ mainAxis: offsetValue }),
    autoPlacement(autoPlacementOptions),
    shift(shiftOptions),
    arrow(arrowOptions),
    size({
      apply({ availableWidth, availableHeight, elements }) {
        Object.assign(elements.floating.style, {
          maxWidth: `${Math.max(minSize, availableWidth)}px`,
          maxHeight: `${Math.max(minSize, availableHeight)}px`,
        })
      },
    }),
    hide(),
  ],
  whileElementsMounted: autoUpdate,
})

/* Arrow */
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
      class="card floating info"
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
        class="arrow info"
      />
      <!-- Actual popover -->
      <slot name="popover" />
    </div>
  </Transition>
</template>

<style lang="sass" scoped>
  /* Do not remove this line, needed for transition effect */
  @use '../assets/transitions.sass'

  .arrow
    clip-path: polygon(0% 0%, 100% 0%, 0% 100%, 0% 0%)
    position: absolute

  .floating
    left: 0
    position: absolute
    top: 0
    width: max-content
    z-index: 99
</style>
