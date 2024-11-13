<script setup lang="ts">
import { arrow, autoPlacement, autoUpdate, hide, offset, useFloating } from '@floating-ui/vue'
import { computed, ref } from 'vue'
const target = ref(null),
  floating = ref(null),
  arrowRef = ref(null),
  { floatingStyles, middlewareData } = useFloating(target, floating, {
    middleware: [offset(16), autoPlacement(), hide(), arrow({ element: arrowRef })],
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
      :style="[floatingStyles, { display: middlewareData.hide?.referenceHidden ? 'none' : 'block' }]"
      @click="middlewareData.hide"
    >
      <div
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
    @apply absolute top-0 left-0 px-6 py-3;
    @apply border border-slate-300 rounded;
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
