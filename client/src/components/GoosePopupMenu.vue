<script setup lang="ts">
import { ref, useTemplateRef, watch, nextTick } from 'vue'
import { useFloatingUI } from '#composables/useFloatingUI.ts'

const props = defineProps<{
  active: boolean
  items: SelectItem[]
  fitTargetWidth?: boolean
  side?: Side
  showSelected?: boolean
}>()

const target = useTemplateRef('target'),
  floating = useTemplateRef('floating'),
  itemsRef = useTemplateRef('itemsRef'),
  selectedId = defineModel<SelectId>({ required: true }),
  side = props.side ?? 'bottom',
  { floatingStyles, isPositioned, middlewareData }
      = useFloatingUI(target, floating, null, { active: props.active, side, fitTargetWidth: props.fitTargetWidth })

function update(newId: SelectId, el) {
  selectedId.value = newId
  emit('update', newId)
}

async function scrollToSelected(instant: boolean) {
  await nextTick()
  const behavior = instant ? 'instant' : 'smooth',
    selectedIndex = props.items.findIndex(i => i.id === selectedId.value),
    highlightedElement = itemsRef.value?.[selectedIndex]

  highlightedElement?.scrollIntoView({ behavior, block: 'center' })

  /* Scroll to top if nothing is selected */
  if (!highlightedElement)
    floating.value?.scrollTo(0, 0)
}

/* Fast scroll to selected item on open */
watch(() => props.active, () => {
  props.active && scrollToSelected(true)
})

/* Slow scroll on selected change */
watch(() => selectedId.value, () => {
  props.active && scrollToSelected(false)
})

const emit = defineEmits(['update'])
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
  @use '../assets/transitions'

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
