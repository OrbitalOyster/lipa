<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue'
  import { useFloatingUI } from '#composables/useFloatingUI.ts'

  const props = defineProps<{
    active: Boolean
    items: SelectItem[]
    fitTargetWidth?: Boolean
    side?: Side
    showSelected?: Boolean
  }>()

  const target = useTemplateRef('target'),
    floating = useTemplateRef('floating'),
    selectedId = defineModel<SelectId>({ required: true }),
    side = props.side ?? 'bottom',
    { floatingStyles, isPositioned, middlewareData }
      = useFloatingUI(target, floating, null, { active: props.active, side, fitTargetWidth: props.fitTargetWidth })
  
  function update(newId: SelectId) {
    selectedId.value = newId
    emit('update', newId)
  }

  const emit = defineEmits(['update'])
</script>

<template>
  <!-- Target element -->
  <span ref="target">
    <slot />
  </span>
  <!-- Pretty animation on toggle -->
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
