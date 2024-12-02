<script setup lang="ts">
import { autoUpdate, hide, size, useFloating } from '@floating-ui/vue'
import { ref, useTemplateRef, watch } from 'vue'
import type { MyFormCheck } from '@stores/formStore.ts'
import { useFormStore } from '@stores/formStore.ts'

const props = defineProps<{
    name: string
    storeId: string
    options: string[]
    checks: MyFormCheck[]
    placeholder: string
  }>(),
  store = useFormStore(props.storeId),
  active = ref(false),
  optionsRef = useTemplateRef<HTMLElement[]>('optionsRef'),
  placement = 'bottom',
  maxDistanceToBottom = 32,
  minHeight = 128,
  selectedIndex = ref<null | number>(null),
  scrollToSelected = (fast: boolean) => {
    if (selectedIndex.value !== null && optionsRef.value !== null) {
      const highlightedElement = optionsRef.value[selectedIndex.value],
        behavior = fast ? 'instant' : 'smooth'
      highlightedElement.scrollIntoView({ behavior, block: 'center' })
    }
  },
  setValue = (ind: number | null) => {
    selectedIndex.value = ind
    /* Resetting value? */
    if (ind === null) {
      store.inputs[props.name] = ''
    }
    else {
      store.inputs[props.name] = props.options[ind]
    }
    store.validate()
  },
  wrap = (r: number, d: number) => (r + d + props.options.length) % props.options.length,
  // eslint-disable-next-line no-useless-assignment
  keyScroll = (d: number) => {
    /* Edge case - nothing selected */
    selectedIndex.value ??= (d > 0 ? -1 : 0)
    setValue(wrap(selectedIndex.value, d))
    if (active.value) {
      scrollToSelected(false)
    }
  },
  target = useTemplateRef<HTMLElement>('target'),
  floating = ref(null),
  // eslint-disable-next-line no-useless-assignment
  { floatingStyles, isPositioned } = useFloating(target, floating, {
    placement,
    open: active,
    middleware: [
      size({
        apply({ availableHeight, rects, elements }) {
          const maxHeight = Math.max(minHeight, availableHeight - maxDistanceToBottom),
            { width } = rects.reference
          Object.assign(elements.floating.style, {
            maxHeight: `${maxHeight.toString()}px`,
            width: `${width.toString()}px`,
          })
        },
      }),
      hide(),
    ],
    whileElementsMounted: autoUpdate,
  })

watch(isPositioned, (opened) => {
  if (opened) {
    scrollToSelected(true)
  }
},
)

store.checks[props.name] = props.checks
store.inputs[props.name] = ''
</script>

<template>
  <div class="flex flex-col justify-center pb-1 relative">
    <input
      v-model="store.inputs[props.name]"
      class="hidden"
      :name
      :placeholder
    >
    <div
      ref="target"
      class="select flex flex-col p-2 pl-4 pt-6 h-14 justify-center select-none cursor-pointer form-input focusable"
      :class="store.errors[props.name] ? 'invalid' : 'valid'"
      tabindex="0"
      @blur="e => active = active && e.relatedTarget === floating"
      @click="active = !active"
      @keydown.up="keyScroll(-1)"
      @keydown.down="keyScroll(1)"
      @keydown.enter="active = !active"
      @keydown.esc="active = false"
    >
      {{ store.inputs[props.name] }}
    </div>
    <label class="form-input-label">
      {{ placeholder }}
    </label>
    <div class="input-icons">
      <div
        class="angle-icon"
        :class="{ 'rotate-180': active }"
      >
        <font-awesome-icon
          :icon="['fas', 'angle-down']"
          size="xl"
        />
      </div>
    </div>
    <Transition name="fade">
      <ul
        v-if="active"
        ref="floating"
        tabindex="0"
        class="card absolute top-0 left-0 mt-2 z-50 overflow-auto"
        :style="floatingStyles"
        @focus="target?.focus()"
      >
        <li
          v-for="(option, i) in options"
          ref="optionsRef"
          :key="i"
          class="p-2 cursor-pointer select-none"
          :class="{ highlighted: selectedIndex === i }"
          @click="setValue(i); active = false"
        >
          {{ option }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
/* Shrink and translate label if:
 * - select is not empty */
.select:not(:empty) + .form-input-label {
  transform: translateY(calc(-50%)) scale(.8);
}

.angle-icon {
  @apply text-slate-500 cursor-pointer transition-transform;
  /* Flexbox */
  @apply inline-flex justify-center items-center;
  /* Misc */
  @apply select-none;
}

li:hover, li.highlighted {
  @apply bg-slate-200;
}
</style>
