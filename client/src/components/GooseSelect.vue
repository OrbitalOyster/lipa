<script setup lang="ts">
import { autoUpdate, flip, hide, offset, size, useFloating } from '@floating-ui/vue'
import { ref, useTemplateRef, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { FormCheck } from '#stores/useFormStore.ts'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useFormStore } from '#stores/useFormStore.ts'

const props = defineProps<{
    checks?: FormCheck[]
    disabled?: boolean
    name: string
    items: string[]
    placeholder: string
    form: string
  }>(),
  store = useFormStore(props.form),
  active = ref(false),
  selectedIndex = ref<null | number>(null),
  itemsRef = useTemplateRef('itemsRef'),
  target = useTemplateRef('target'),
  floating = useTemplateRef('floating')

/* Fine tuning */
const placement = 'bottom',
  maxDistanceToEdge = 16,
  minHeight = 128,
  offsetValue = 8

/* Floating UI bollocks */
const { floatingStyles, isPositioned, middlewareData } = useFloating(target, floating, {
  open: active,
  placement,
  strategy: 'fixed',
  middleware: [
    offset({ mainAxis: offsetValue }),
    flip(),
    size({
      apply({ availableHeight, rects, elements }) {
        const maxHeight = Math.max(minHeight, availableHeight - maxDistanceToEdge),
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

function wrap(value: number, direction: number) {
  return (value + direction + props.items.length) % props.items.length
}

function setValue(value: number | null) {
  selectedIndex.value = value
  /* Resetting value? */
  if (value === null || !props.items[value] /* Should not happen */)
    store.inputs[props.name] = ''
  else
    store.inputs[props.name] = props.items[value]
  store.validate()
}

function keyScroll(direction: number) {
  /* Edge case - nothing selected */
  selectedIndex.value ??= (direction > 0 ? -1 : 0)
  setValue(wrap(selectedIndex.value, direction))
  if (active.value)
    scrollToSelected(false)
}

function scrollToSelected(instant: boolean) {
  if (selectedIndex.value !== null) {
    const highlightedElement = itemsRef.value?.[selectedIndex.value],
      behavior = instant ? 'instant' : 'smooth'
    highlightedElement?.scrollIntoView({ behavior, block: 'center' })
  }
}

watch(isPositioned, opened => opened && scrollToSelected(true))

store.checks[props.name] = props.checks ?? []
store.inputs[props.name] = ''
</script>

<template>
  <div style="align-items: center; display: flex; position: relative">
    <input
      v-model="store.inputs[props.name]"
      :name
      :placeholder
    >
    <div
      ref="target"
      :class="['focusable', 'form-input', 'target', store.errors[props.name] ? 'invalid' : 'valid']"
      :tabindex="disabled ? -1 : 0"
      @blur="e => active = active && e.relatedTarget === floating"
      @click="active = !active"
      @keydown.up.prevent="keyScroll(-1)"
      @keydown.down.prevent="keyScroll(1)"
      @keydown.enter="active = !active"
      @keydown.esc="active = false"
    >
      {{ store.inputs[props.name] }}
    </div>
    <label>
      {{ placeholder }}
    </label>
    <div class="input-icons">
      <FontAwesomeIcon
        class="chevron"
        :icon="faChevronDown"
        size="xl"
      />
    </div>
    <Transition name="fade">
      <ul
        v-if="active"
        ref="floating"
        tabindex="0"
        :style="{
          ...floatingStyles,
          visibility: middlewareData.hide?.referenceHidden
            ? 'hidden'
            : 'visible'
        }"
        @focus="target?.focus()"
      >
        <li
          v-for="(option, i) in items"
          ref="itemsRef"
          :key="i"
          :class="{ selected: selectedIndex === i }"
          @click="setValue(i); active = false"
        >
          {{ option }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'
  @use '../assets/style'
  @use '../assets/transitions'

  input
    display: none

  .target
    align-items: center
    cursor: pointer
    display: flex
    height: 2rem
    padding: 1.5rem 1rem .25rem 1rem
    transition: transitions.$focusable, transitions.$colors
    user-select: none
    width: 100%

  label
    color: colors.$input-label
    left: 1rem
    pointer-events: none
    position: absolute
    transform-origin: left
    transition: transitions.$transform
    user-select: none

  /* Shrink and translate label if:
   * - input is focused
   * - placeholder not shown
   * - input is not empty */
  .target[placeholder]:focus + label,
  .target[placeholder]:not(:placeholder-shown) + label,
  .target:not(:empty) + label
    transform: translateY(calc(-70%)) scale(.9)

  .input-icons
    align-items: center
    display: inline-flex
    height: 100%
    pointer-events: none
    position: absolute
    right: 1rem
    user-select: none

  .chevron
    transform: v-bind("active ? 'rotate(180deg)' : 'rotate(0)'")
    transition: transitions.$transform

  ul
    @extend .card
    overflow-y: auto
    overscroll-behavior: none
    padding: 0
    margin: 0
    position: absolute
    z-index: 99

  li
    cursor: pointer
    display: block
    padding: 1rem
    user-select: none

  li:hover
    background-color: #EAECEE

  li.selected
    background-color: #D5D8DC
</style>
