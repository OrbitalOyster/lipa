<script setup lang="ts">
import { arrow, autoPlacement, size, flip, autoUpdate, hide, offset, useFloating } from '@floating-ui/vue'
import { computed, ref } from 'vue'

const props = defineProps({
  arrow: Boolean,
  auto: Boolean,
  matchWidth: Boolean,
  placement: {
    type: String,
    default: 'top',
  }
});

const offsetValue = props.arrow ? 16 : 2

if (!props.auto && !props.placement) {
  console.log(props)
  throw new Error('Invalid popover props')
}

const target = ref(null),
  floating = ref(null),
  elements = {floating: floating.value},
  arrowRef = ref(null),
  targetWidth = computed(() => target.value?.offsetWidth),
  { floatingStyles, middlewareData } = useFloating(target, floating, {
    placement: props.placement,
    middleware: [
      offset({mainAxis: offsetValue}),
      props.auto && autoPlacement(),
      props.auto || flip(),
      hide(),
      arrow({ element: arrowRef, padding: 8 }),

    size({
      apply({elements}) {
        Object.assign(elements.floating.style, {
          maxWidth: `${Math.max(0, targetWidth)}px`,
          maxHeight: `${Math.max(0, 400)}px`,
        });
      },
    }),

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
  })
</script>

<template>
  <span>
    <div
      ref="floating"
      class="floating"
      :style="[
        floatingStyles, { 
          display: middlewareData.hide?.referenceHidden ? 'none' : 'block',
          width: (matchWidth ? `${targetWidth}px` : 'auto'),
        }
      ]"
      @click="console.log(targetWidth)"
    >
      <div
        v-if="props.arrow"
        ref="arrowRef"
        class="arrow"
        :style="arrowStyle"
      />
      <slot name="popover" />
    </div>
    <div
      ref="target"
      class="inline-block"
    >
      <slot />
    </div>
  </span>
</template>

<style scoped>
  .floating {
    display: none;
    @apply absolute top-0 left-0 px-6 py-3;
    @apply border border-slate-300 rounded overflow-auto;
    @apply bg-white;
    @apply drop-shadow;
  }

  .arrow {
    width: 16px;
    height: 16px;
    @apply absolute bg-white;
    @apply border-slate-300 border-t border-l;
  }
</style>
