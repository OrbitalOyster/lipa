<script setup lang="ts">
import { faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseErrorIcon from '#components/GooseErrorIcon.vue'
import GooseInputPlaceholder from '#components/GooseInputPlaceholder.vue'
import GoosePopupMenu from '#components/GoosePopupMenu.vue'
import type { Side } from '@floating-ui/core'
import { ref } from 'vue'

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
  selectedId = defineModel<SelectId>({ required: true })

function update(newId: SelectId) {
  if (newId === selectedId.value)
    return
  selectedId.value = newId
  emit('update', newId)
}

function keyScroll(direction: number) {
  let selectedIndex = props.items.findIndex(i => i.id === selectedId.value)
  /* Edge case - nothing selected */
  if (selectedIndex === -1)
    selectedIndex = direction > 0 ? -1 : 0
  /* Wrap around items */
  selectedIndex = (selectedIndex + direction + props.items.length) % props.items.length
  /* Set actual value */
  const selectedItem = props.items[selectedIndex]
  /* Should not happen */
  if (!selectedItem)
    throw new Error('Major screwup')
  update(selectedItem.id)
}
</script>

<template>
  <GoosePopupMenu
    v-model="selectedId"
    :active
    :items
    :side
    :fit-target-width="true"
    :show-selected="true"
    @update="newId => { active = false; update(newId) }"
  >
    <div class="select-wrapper">
      <!-- Pseudo-input -->
      <button
        type="button"
        :class="{ invalid: error, valid: !error, 'has-placeholder': !!placeholder }"
        :disabled
        :autofocus
        @blur="active = false"
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
        :style="{ transform: active ? 'rotate(180deg)' : 'rotate(0)' }"
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
    </div>
  </GoosePopupMenu>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  .select-wrapper
    align-items: center
    display: flex
    position: relative

  button
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
    white-space: nowrap
    width: 100%

  /* On focus */
  button:focus
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  /* On disabled */
  button:disabled
    background-color: colors.$input-disabled
    border-color: colors.$input-disabled
    color: colors.$disabled-primary
    cursor: not-allowed

  .has-placeholder
    height: 3.5rem
    padding-top: 1.5rem

  .placeholder
    width: calc(100% - 3.5rem)

  .item
    line-height: 1.25rem
    overflow: hidden
    text-overflow: ellipsis

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

  button:disabled ~ .chevron
    color: colors.$disabled-primary
</style>
