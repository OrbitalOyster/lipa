<script setup lang="ts">
import { Placement, arrow, autoUpdate, flip, hide, offset, shift, size, useFloating } from '@floating-ui/vue'
import { computed, ref } from 'vue'

const props = defineProps<{
    hasArrow: boolean
    clickToggle?: boolean
    placement: Placement
  }>(),
  active = ref(false),
  minSize = 128,
  offsetValue = props.hasArrow ? 16 : 2,
  target = ref(null),
  floating = ref<HTMLElement | null>(null),
  arrowRef = ref(null),
  // eslint-disable-next-line no-useless-assignment
  { floatingStyles, middlewareData } = useFloating(target, floating, {
    open: active,
    placement: props.placement,
    middleware: [
      offset({ mainAxis: offsetValue }),
      flip(),
      shift({ padding: 16 }),
      arrow({ element: arrowRef, padding: 4 }),
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
  }),
  // eslint-disable-next-line no-useless-assignment
  arrowStyle = computed(() => {
    const side = <string>middlewareData.value.offset?.placement.split('-')[0],
      rotation = { top: -135, right: -45, bottom: 45, left: 135 }[side] || 0,
      floatingWidth = floating.value?.offsetWidth || 0,
      floatingHeight = floating.value?.offsetHeight || 0,
      leftOffset = side === 'left' ? 1 : 0,
      topOffset = side === 'top' ? 1 : 0,
      middlewareArrow = middlewareData.value.arrow,
      arrowOffset = 9
    return {
      transform: `rotate(${rotation.toString()}deg)`,
      left: middlewareArrow?.x || middlewareArrow?.x === 0
        ? `${middlewareArrow.x.toString()}px`
        : `${(floatingWidth * leftOffset - arrowOffset).toString()}px`,
      top: middlewareArrow?.y || middlewareArrow?.y === 0
        ? (`${middlewareArrow.y.toString()}px`)
        : `${(floatingHeight * topOffset - arrowOffset).toString()}px`,
    }
  }),

  toggle = () => {
    active.value = !active.value
  }

defineExpose({ toggle, active })

</script>

<template>
  <div
    ref="target"
    class="inline-block"
    @click="props.clickToggle && toggle()"
  >
    <slot />
  </div>

  <div
    v-if="active"
    ref="floating"
    class="floating"
    :style="floatingStyles"
  >
    <div
      v-if="props.hasArrow"
      ref="arrowRef"
      :style="arrowStyle"
      class="arrow"
    />
    <div class="h-[inherit] w-[inherit] overflow-auto">
      <div>
        <slot name="popover" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .floating {
    @apply absolute top-0 left-0;
    @apply outline-none border border-slate-300 rounded;
    @apply bg-white;
    @apply drop-shadow;
  }

  .arrow {
    width: 16px;
    height: 16px;
    clip-path: polygon(0% 0%, 100% 0%, 0% 100%, 0% 0%);
    @apply absolute;
    @apply bg-white;
    @apply border-slate-300 border-t border-l;
  }
</style>
