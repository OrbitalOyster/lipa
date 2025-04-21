<script setup lang="ts">
import { arrow, autoPlacement, autoUpdate, hide, offset, shift, size, useFloating } from '@floating-ui/vue'
import { computed, ref, useTemplateRef } from 'vue'
import type { Placement } from '@floating-ui/utils'
import { refDebounced } from '@vueuse/core'

const props = defineProps<{
    hasArrow?: boolean
    clickToggle?: boolean
    hoverToggle?: boolean
    placement?: Placement
  }>(),
  active = ref(false),
  debounced = refDebounced(active, 500),
  target = useTemplateRef('target'),
  floating = useTemplateRef('floating'),
  arrowRef = useTemplateRef('arrowRef')

const minSize = 256,
  offsetValue = props.hasArrow ? 14 : 2,
  autoPlacementOptions = props.placement ? { allowedPlacements: [props.placement] } : {},
  shiftOptions = { padding: 8 },
  arrowOptions = { element: arrowRef, padding: 8 }

/* Floating UI */
const { floatingStyles, middlewareData } = useFloating(target, floating, {
  open: active,
  placement: props.placement,
  middleware: [
    offset({ mainAxis: offsetValue }),
    autoPlacement(autoPlacementOptions),
    shift(shiftOptions),
    arrow(arrowOptions),
    size({
      apply({ availableWidth, availableHeight, elements }) {
        Object.assign(elements.floating.style, {
          maxWidth: `${Math.max(minSize, availableWidth).toString()}px`,
          maxHeight: `${Math.max(minSize, availableHeight).toString()}px`,
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
    const side = middlewareData.value.offset?.placement.split('-')[0] ?? 'top',
      staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[side] ?? 'bottom',
      rotation = { top: -135, right: -45, bottom: 45, left: 135 }[side] ?? 0,
      middlewareArrow = middlewareData.value.arrow
    return {
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
        visibility: middlewareData.hide?.referenceHidden
          ? 'hidden'
          : 'visible'
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
    height: 1rem
    position: absolute
    width: 1rem

  .floating
    position: absolute
    z-index: 99
</style>
