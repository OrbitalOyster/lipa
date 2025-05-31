<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseInputPlaceholder from '#components/GooseInputPlaceholder.vue'
import type { Side } from '@floating-ui/core'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useFloatingUI } from '#composables/useFloatingUI.ts'

const props = defineProps<{
    checks?: FormCheck[]
    disabled?: boolean
    items: string[]
    placeholder: string
    side?: Side
  }>(),
  active = ref(false),
  selectedIndex = ref<null | number>(null),
  itemsRef = useTemplateRef('itemsRef'),
  target = useTemplateRef('target'),
  floating = useTemplateRef('floating')

const model = defineModel<string>({ default: '' })

const fitTargetWidth = true,
  side = props.side ?? 'bottom',
  { floatingStyles, isPositioned, middlewareData }
    = useFloatingUI(target, floating, null, { active, side, fitTargetWidth })

function wrap(value: number, direction: number) {
  return (value + direction + props.items.length) % props.items.length
}

const setValue = (value: number | null) => {
  selectedIndex.value = value
  /* Resetting value? */
  if (value === null || !props.items[value] /* Should not happen */)
    model.value = ''
  else
    model.value = props.items[value]
  // store.validate()
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

watch(isPositioned, isOpen => isOpen && scrollToSelected(true))

const error = ''
</script>

<template>
  <div style="align-items: center; display: flex; position: relative">
    <!-- Actual input element (hidden) -->
    <input
      v-model="model"
      :placeholder
    >
    <!-- Pseudo-input -->
    <div
      ref="target"
      class="target"
      :class="error ? 'invalid' : 'valid'"
      :tabindex="disabled ? -1 : 0"
      @blur="e => active = active && e.relatedTarget === floating"
      @click="active = !active"
      @keydown.up.prevent="keyScroll(-1)"
      @keydown.down.prevent="keyScroll(1)"
      @keydown.enter="active = !active"
      @keydown.esc="active = false"
    >
      {{ model }}
    </div>
    <!-- Placeholder -->
    <GooseInputPlaceholder v-if="placeholder">
      {{ placeholder }}
    </GooseInputPlaceholder>
    <!-- Icons -->
    <div class="input-icons">
      <FontAwesomeIcon
        class="chevron"
        :style="{transform: active ? 'rotate(180deg)' : 'rotate(0)'}"
        :icon="faChevronDown"
        size="xl"
      />
    </div>
    <!-- Pretty transition -->
    <Transition name="fade">
      <!-- Drop-down list -->
      <ul
        v-if="active"
        ref="floating"
        tabindex="0"
        :style="{
          ...floatingStyles,
          visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible'
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
  @use '../assets/borders'
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
    border-color: colors.$outline
    outline: colors.$outline solid 0px
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: 1px solid colors.$input-border

  .target:focus
    outline-width: borders.$focus-outline-width

  .input-icons
    align-items: center
    display: inline-flex
    height: 100%
    pointer-events: none
    position: absolute
    right: 1rem
    user-select: none

  .chevron
    transition: transitions.$transform

  ul
    background-color: colors.$card
    border-radius: borders.$radius
    border: borders.$card
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)
    margin-bottom: .25rem
    margin: 0
    overflow-y: auto
    overscroll-behavior: none
    padding: 0
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
