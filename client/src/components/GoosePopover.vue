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
      /* Rotate rectangle, shape it into an arrow */
      rotation = { top: -135, right: -45, bottom: 45, left: 135 }[side] ?? 0,
      floatingWidth = floating.value?.offsetWidth ?? 0,
      floatingHeight = floating.value?.offsetHeight ?? 0,
      leftOffset = side === 'left' ? 1 : 0,
      topOffset = side === 'top' ? 1 : 0,
      middlewareArrow = middlewareData.value.arrow,
      arrowOffset = side === 'right' || side === 'bottom' ? 9 : 11
    return {
      transform: `rotate(${rotation.toString()}deg)`,
      left: middlewareArrow?.x || middlewareArrow?.x === 0
        ? `${middlewareArrow.x.toString()}px`
        : `${(floatingWidth * leftOffset - arrowOffset).toString()}px`,
      top: middlewareArrow?.y || middlewareArrow?.y === 0
        ? (`${middlewareArrow.y.toString()}px`)
        : `${(floatingHeight * topOffset - arrowOffset).toString()}px`,
    }
  })

function toggle() {
  active.value = !active.value
}

defineExpose({ toggle, active })
</script>

<template>
  <div
    ref="target"
    style="display: inline"
    @click="clickToggle && toggle()"
    @mouseover="hoverToggle && (active = true)"
    @mouseleave="hoverToggle && (active = false)"
  >
    <slot />
  </div>
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
      <div
        v-if="hasArrow"
        ref="arrowRef"
        :style="arrowStyle"
        class="arrow info"
      />
      <div class="popover">
        <slot name="popover" />
      </div>
    </div>
  </Transition>
</template>

<style lang="sass" scoped>
  /* Do not remove this line, needed for transition effect */
  @use '../assets/transitions.sass'

  .arrow
    clip-path: polygon(0% 0%, 100% 0%, 0% 100%, 0% 0%)
    height: 16px
    position: absolute
    width: 16px

  .floating
    position: absolute
    z-index: 99

  .popover
    height: inherit
    overflow: auto
    width: inherit
</style>
