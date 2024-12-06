<script setup lang="ts">
import { autoUpdate, hide, size, useFloating } from '@floating-ui/vue'
import { ref, useTemplateRef, watch } from 'vue'
import type { MyFormCheck } from '@stores/formStore.ts'
import { useFormStore } from '@stores/formStore.ts'
const props = defineProps<{
    name: string
    storeId: string
    options: string[]
    checks?: MyFormCheck[]
    placeholder: string
    disabled?: boolean
  }>(),
  store = useFormStore(props.storeId),
  active = ref(false),
  optionsRef = useTemplateRef('optionsRef'),
  placement = 'bottom',
  maxDistanceToBottom = 32,
  minHeight = 128,
  selectedIndex = ref<null | number>(null),
  scrollToSelected = (instant: boolean) => {
    if (selectedIndex.value !== null) {
      const highlightedElement = optionsRef.value?.[selectedIndex.value],
        behavior = instant ? 'instant' : 'smooth'
      highlightedElement?.scrollIntoView({ behavior, block: 'center' })
    }
  },
  setValue = (value: number | null) => {
    selectedIndex.value = value
    /* Resetting value? */
    if (value === null) {
      store.inputs[props.name] = ''
    }
    else {
      store.inputs[props.name] = props.options[value]
    }
    store.validate()
  },
  wrap = (value: number, direction: number) =>
    (value + direction + props.options.length) % props.options.length,
  // eslint-disable-next-line no-useless-assignment
  keyScroll = (direction: number) => {
    /* Edge case - nothing selected */
    selectedIndex.value ??= (direction > 0 ? -1 : 0)
    setValue(wrap(selectedIndex.value, direction))
    if (active.value) {
      scrollToSelected(false)
    }
  },
  target = useTemplateRef('target'),
  floating = useTemplateRef('floating'),
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
store.checks[props.name] = props.checks ?? []
store.inputs[props.name] = ''
</script>

<template>
  <div
    class="flex items-center relative"
    :class="{ 'form-input-disabled': disabled }"
  >
    <input
      v-model="store.inputs[props.name]"
      class="hidden"
      :name
      :placeholder
    >
    <div
      ref="target"
      class="form-input focusable flex items-center w-full px-4 pt-4 h-14 select-none cursor-pointer"
      :class="store.errors[props.name] ? 'invalid' : 'valid'"
      :tabindex="disabled ? -1 : 0"
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
      <font-awesome-icon
        v-if="store.errors[props.name]"
        :icon="['fas', 'triangle-exclamation']"
        :title="store.errors[props.name]"
        size="xl"
        class="alert text-rose-400 pointer-events-auto"
      />
      <div
        class="text-slate-500 transition-[transform]"
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
        class="card absolute mt-2 z-50 overflow-y-auto"
        :style="floatingStyles"
        @focus="target?.focus()"
      >
        <li
          v-for="(option, i) in options"
          ref="optionsRef"
          :key="i"
          class="p-2 cursor-pointer select-none"
          :class="selectedIndex === i && 'bg-slate-200' || 'hover:bg-slate-100'"
          @click="setValue(i); active = false"
        >
          {{ option }}
        </li>
      </ul>
    </Transition>
  </div>
</template>
