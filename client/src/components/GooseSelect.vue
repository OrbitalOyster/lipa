<script setup lang="ts">
import { faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { ref, useTemplateRef, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseErrorIcon from '#components/GooseErrorIcon.vue'
import GooseInputPlaceholder from '#components/GooseInputPlaceholder.vue'
import type { Side } from '@floating-ui/core'
import { useFloatingUI } from '#composables/useFloatingUI.ts'

const props = defineProps<{
  autofocus?: boolean
  checks?: FormCheck[]
  disabled?: boolean
  error?: string
  loading?: boolean
  items: SelectItem[]
  placeholder?: string
  side?: Side
}>(),
  emit = defineEmits(['update']),
  active = ref(false),
  selectedId = defineModel<string>({ required: true }),
  itemsRef = useTemplateRef('itemsRef'),
  target = useTemplateRef('target'),
  floating = useTemplateRef('floating')

const fitTargetWidth = true,
  side = props.side ?? 'bottom',
  { floatingStyles, isPositioned, middlewareData }
    = useFloatingUI(target, floating, null, { active, side, fitTargetWidth })

function wrap(value: number, direction: number) {
  return (value + direction + props.items.length) % props.items.length
}

function update(newId: string) {
  selectedId.value = newId
  emit('update', newId)
}

function keyScroll(direction: number) {
  let selectedIndex = props.items.findIndex(i => i.id === selectedId.value)
  /* Edge case - nothing selected */
  if (selectedIndex === -1)
    selectedIndex = direction > 0 ? -1 : 0
  selectedIndex = wrap(selectedIndex, direction)
  /* Set actual value */
  const selectedItem = props.items[selectedIndex]
  /* Should not happen */
  if (!selectedItem)
    throw new Error('Major screwup')
  update(selectedItem.id)
  if (active.value)
    scrollTo(selectedIndex, false)
}

function scrollTo(selectedIndex: number, instant: boolean) {
  const highlightedElement = itemsRef.value?.[selectedIndex],
    behavior = instant ? 'instant' : 'smooth'
  highlightedElement?.scrollIntoView({ behavior, block: 'center' })

  /* Scroll to top if nothing is selected */
  if (!highlightedElement)
    floating.value?.scrollTo(0, 0)
}

/* Deactivate element on blur, but only if focus target is not drop-down list */
function onTargetBlur(e: FocusEvent) {
  if (e.relatedTarget !== floating.value)
    active.value = false
}

watch(isPositioned, isOpen => isOpen && scrollTo(props.items.findIndex(i => i.id === selectedId.value), true))

</script>

<template>
  <div
    class="select-wrapper"
  >
    <!-- Pseudo-input -->
    <button
      ref="target"
      type="button"
      class="target"
      :class="{ invalid: error, valid: !error, 'has-placeholder': !!placeholder }"
      :disabled
      :autofocus
      @blur="onTargetBlur"
      @click="active = !active"
      @keydown.up.prevent="keyScroll(-1)"
      @keydown.down.prevent="keyScroll(1)"
      @keydown.esc="active = false"
    >
      <div class="item">
        {{ items.find(i => i.id === selectedId)?.title }}
      </div>
    </button>
    <!-- Placeholder -->
    <GooseInputPlaceholder
      v-if="placeholder"
      :title="placeholder"
      :active="!!selectedId"
      class="placeholder"
    />
    <!-- Chevron -->
    <FontAwesomeIcon
      class="chevron"
      :style="{transform: active ? 'rotate(180deg)' : 'rotate(0)'}"
      :icon="faChevronDown"
      size="xl"
    />
    <!-- Icons -->
    <div class="icons">
      <!-- Validation icon -->
      <GooseErrorIcon
        v-if="error"
        :message="error"
      />
      <!-- Loading -->
      <FontAwesomeIcon
        v-if="loading"
        class="fa-pulse"
        :icon="faSpinner"
        size="xl"
      />
    </div>
    <!-- Pretty transition -->
    <Transition name="fade">
      <!-- Drop-down list -->
      <ul
        v-show="active && !middlewareData.hide?.referenceHidden"
        ref="floating"
        tabindex="0"
        :style="{ ...floatingStyles }"
        @focus="target?.focus()"
      >
        <li
          v-for="item in items"
          ref="itemsRef"
          :key="item.id"
          :class="{ selected: selectedId === item.id }"
          @click="update(item.id); active = false"
        >
          {{ item.title }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  .select-wrapper
    align-items: center
    display: inline-flex
    min-width: 3.5rem
    position: relative

  .target
    align-items: center
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: 1px solid colors.$input-border
    color: colors.$text
    cursor: pointer
    display: flex
    font: inherit
    height: 2.5rem
    outline: colors.$outline solid 0px
    padding: .25rem 2.5rem 0.25rem .75rem
    transition: transitions.$focusable, transitions.$colors
    user-select: none
    white-space: nowrap
    width: 100%

  .has-placeholder
    height: 3.5rem
    padding-top: 1.5rem

  .placeholder
    width: calc(100% - 3.5rem)

  .item
    line-height: 1.25rem
    overflow: hidden
    padding-right: .5rem
    text-overflow: ellipsis

  /* On focus */
  .target:focus
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  /* On disabled */
  .target:disabled
    background-color: colors.$input-disabled
    border-color: colors.$input-disabled
    color: colors.$disabled-primary
    cursor: not-allowed
    /* pointer-events: none */

  .icons
    align-items: center
    display: inline-flex
    gap: .25rem
    height: 100%
    position: absolute
    right: 2.75rem

  .chevron
    height: 1.5rem
    pointer-events: none
    position: absolute
    right: 1rem
    transition: transitions.$transform
    width: 1.5rem

  .target:disabled ~ .chevron
    color: colors.$disabled-primary

  ul
    background-color: colors.$card
    border-radius: borders.$radius
    border: borders.$card
    box-sizing: border-box
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)
    margin-bottom: .25rem
    overflow-y: auto
    overscroll-behavior: none
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
