<script setup lang="ts">
import { arrow, autoPlacement, autoUpdate, flip, hide, offset, size, useFloating, inline } from '@floating-ui/vue'
import { computed, nextTick, onMounted, ref, useSlots, useTemplateRef } from 'vue'

const props = defineProps({
    arrow: Boolean,
    flip: Boolean,
    matchWidth: Boolean,
    placement: {
      type: String,
      default: 'top',
    },
  }),

  offsetValue = props.arrow ? 16 : 2,

  target = ref(null),
  floating = ref(null),
  elements = { floating: floating.value },
  arrowRef = ref(null),
  { floatingStyles, middlewareData } = useFloating(target, floating, {
    placement: props.placement,
    middleware: [
      offset({ mainAxis: offsetValue }),
      props.flip && flip(),
      arrow({ element: arrowRef, padding: 8 }),

      size({
        apply({ availableWidth, availableHeight, rects, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.max(128, availableWidth)}px`,
            maxHeight: `${Math.max(128, availableHeight - 32)}px`,
            minWidth1: `${rects.reference.width}px`,
            width: `${rects.reference.width.toString()}px`,
            width1: `100px`,
          })
        },
      }),

      hide(),
    ],
    whileElementsMounted: autoUpdate,
  }),
  arrowStyle = computed(() => {
    const side = <string>middlewareData.value.offset?.placement.split('-')[0],
      rotation = { top: -135, right: -45, bottom: 45, left: 135 }[side] || 0
    return {
      transform: `rotate(${rotation.toString()}deg)`,
      left: middlewareData.value.arrow?.x != null
        ? `${middlewareData.value.arrow.x.toString()}px`
        : `${(floating.value?.offsetWidth * (side === 'left') - 9).toString()}px`,
      top: middlewareData.value.arrow?.y != null
        ? (`${middlewareData.value.arrow.y.toString()}px`)
        : `${(floating.value?.offsetHeight * (side === 'top') - 9).toString()}px`,
    }
  }),
  active = ref(false),

  toggle = () => active.value = !active.value

defineExpose({ toggle, active })

</script>


<template>
    <div
      ref="target"
      class="inline-block"
    >
      <slot />
    </div>

    <div
      ref="floating"
      class="floating"
      :style="[
        floatingStyles, { 
          visibility: (middlewareData.hide?.referenceHidden || !active) ? 'hidden' : 'visible',
        }
      ]"
    >

      <div
        v-if="props.arrow"
        ref="arrowRef"
        class="arrow"
        :style="arrowStyle"
      />

      <slot name="popover" />
    </div>

</template>

<style scoped>
  .floating {
    @apply absolute top-0 left-0;
    @apply outline-none border border-slate-300 rounded overflow-auto;
    @apply bg-white;
    @apply drop-shadow;
  }

  .arrow {
    width: 16px;
    height: 16px;
    @apply z-50;
    @apply absolute bg-yellow-400;
    @apply border-slate-300 border-t border-l;
  }
</style>
