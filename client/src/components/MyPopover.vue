<script setup lang="ts">
import { arrow, autoPlacement, size, flip, autoUpdate, hide, offset, useFloating } from '@floating-ui/vue'
import { computed, ref, useSlots, onMounted, useTemplateRef } from 'vue'

const props = defineProps({
  arrow: Boolean,
  flip: Boolean,
  matchWidth: Boolean,
  placement: {
    type: String,
    default: 'top',
  }
});

const offsetValue = props.arrow ? 16 : 2

const target = ref(null),
  floating = ref(null),
  elements = {floating: floating.value},
  arrowRef = ref(null),
  targetWidth = computed(() => target.value?.offsetWidth),
  { floatingStyles, middlewareData } = useFloating(target, floating, {
    placement: props.placement,
    middleware: [
      offset({mainAxis: offsetValue}),
      props.flip && flip(),
      arrow({ element: arrowRef, padding: 8 }),

      size({
        apply({availableWidth, availableHeight, elements}) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.max(64, availableWidth)}px`,
            maxHeight: `${Math.max(64, availableHeight - 32)}px`,
          });
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
  hidden = ref(true),
  toggle = () => hidden.value = !hidden.value

defineExpose({ toggle })

</script>

<template>
  <div ref="target">


  <div
    ref="floating"
    class="floating bg-yellow-500"
    :style="[
      floatingStyles, { 
        display: (middlewareData.hide?.referenceHidden || hidden) ? 'none' : 'block',
        width: (matchWidth ? `${targetWidth}px` : '100%'),
      }
    ]"
  >

    <slot name="popover" />

    <div
      v-if="props.arrow"
      ref="arrowRef"
      class="arrow"
      :style="arrowStyle"
    />

  </div>




    <slot />
  </div>



</template>

<style scoped>
  .floating {
    @apply absolute top-0 left-0;
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
