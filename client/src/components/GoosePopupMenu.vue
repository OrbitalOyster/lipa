<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import type { Side } from '@floating-ui/core'
import { useFloatingUI } from '#composables/useFloatingUI.ts'

const props = defineProps<{
    active: boolean
    fitTargetWidth?: boolean
    items: SelectItem[]
    showSelected?: boolean
    side?: Side
  }>(),
  target = useTemplateRef('target'),
  floating = useTemplateRef('floating'),
  itemsRef = useTemplateRef('itemsRef'),
  selectedId = defineModel<SelectId>({ required: true }),
  side = props.side ?? 'bottom',
  { floatingStyles, middlewareData }
    = useFloatingUI(target, floating, null, { active: props.active, side, fitTargetWidth: props.fitTargetWidth }),
  emit = defineEmits(['update'])

const update = (newId: SelectId) => {
  selectedId.value = newId
  emit('update', newId)
}

const scrollToSelected = async (instant: boolean) => {
  await nextTick()
  const behavior = instant ? 'instant' : 'smooth',
    selectedIndex = props.items.findIndex(i => i.id === selectedId.value),
    highlightedElement = itemsRef.value?.[selectedIndex]
  /* TODO: Cocks up viewport scrolling */
  // highlightedElement?.scrollIntoView({ behavior, block: 'center' })
  highlightedElement?.scrollIntoView({ behavior, block: 'nearest' })
  /* Scroll to top if nothing is selected */
  if (!highlightedElement)
    floating.value?.scrollTo(0, 0)
}

/* Fast scroll to selected item on open */
watch(() => props.active, async () => props.active && await scrollToSelected(true))

/* Slow scroll on selected change */
watch(() => selectedId.value, async () => props.active && await scrollToSelected(false))
</script>

<template>
  <!-- Target element -->
  <div ref="target">
    <slot />
  </div>
  <!-- Pretty animation on toggle -->
  <Transition name="fade">
    <!-- Drop-down list; @mousedown.prevent to keep focus off -->
    <ul
      v-show="active && !middlewareData.hide?.referenceHidden"
      ref="floating"
      tabindex="-1"
      :style="{ ...floatingStyles }"
      @mousedown.prevent
    >
      <li
        v-for="item in items"
        ref="itemsRef"
        :key="item.id"
        :class="{ selected: showSelected && selectedId === item.id }"
        @click="update(item.id)"
      >
        {{ item.title }}
      </li>
    </ul>
  </Transition>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/filters'
  @use '../assets/sizings'
  @use '../assets/transitions'

  ul
    background-color: colors.$card
    border-radius: borders.$radius
    border: borders.$card
    box-sizing: border-box
    filter: filters.$card-shadow
    overflow-y: auto
    user-select: none
    z-index: 10

  li
    cursor: pointer
    padding: sizings.$menu-item-padding
    user-select: none

  li:hover
    background-color: colors.$menu-item-hover

  li.selected
    background-color: colors.$menu-item-select
</style>
