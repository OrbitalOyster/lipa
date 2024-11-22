<script setup lang="ts">
import { arrow, autoUpdate, flip, hide, offset, shift, size, useFloating } from '@floating-ui/vue'
import { computed, ref } from 'vue'

const props = defineProps<{
    hasArrow: boolean,
    clickToggle: boolean,
    placement: string,
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
    placement: <string> props.placement,
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
