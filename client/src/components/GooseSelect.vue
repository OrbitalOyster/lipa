<script setup lang="ts">
import { faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { ref, useTemplateRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseErrorIcon from '#components/GooseErrorIcon.vue'
import GooseInputPlaceholder from '#components/GooseInputPlaceholder.vue'
import GoosePopupMenu from '#components/GoosePopupMenu.vue'
import type { Side } from '@floating-ui/core'
import { useElementSize } from '@vueuse/core'

const props = defineProps<{
    autofocus?: boolean
    checks?: FormCheck[]
    disabled?: boolean
    disabledOnLoading?: boolean
    error?: string
    loading?: boolean
    items: SelectItem[]
    placeholder?: string
    side?: Side
  }>(),
  icons = useTemplateRef('icons'),
  emit = defineEmits(['update']),
  active = ref(false),
  selectedId = defineModel<SelectId>({ required: true })

/* Icons width */
const { width } = useElementSize(icons, { width: 0, height: 0 }, { box: 'border-box' })

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
  <div>
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
          :autofocus
          :class="{ invalid: error, valid: !error, 'has-placeholder': !!placeholder }"
          :disabled="disabled || loading && disabledOnLoading"
          :style="{ paddingRight: width + 'px' }"
          @blur="active = false"
          @click="active = !active"
          @keydown.up.prevent="keyScroll(-1)"
          @keydown.down.prevent="keyScroll(1)"
          @keydown.esc="active = false"
        >
          <div
            v-if="selectedId"
            class="item"
          >
            {{ items.find(i => i.id === selectedId)?.title }}
          </div>
        </button>
        <!-- Placeholder -->
        <GooseInputPlaceholder
          v-if="placeholder"
          :active="!!selectedId"
          :style="{ width: `calc(100% - ${width}px - .75rem)` }"
          :title="placeholder"
        />
        <!-- Icons -->
        <div
          ref="icons"
          class="icons"
        >
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
          <!-- Chevron -->
          <FontAwesomeIcon
            class="chevron"
            :style="{ transform: active ? 'rotate(180deg)' : 'rotate(0)' }"
            :icon="faChevronDown"
            size="xl"
          />
        </div>
      </div>
    </GoosePopupMenu>
  </div>
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
    border: borders.$form-input
    color: colors.$text
    cursor: pointer
    display: flex
    height: 2.5rem
    outline: colors.$outline solid 0px
    padding-bottom: .25rem
    padding-left: .75rem
    padding-top: .25rem
    transition: transitions.$focusable, transitions.$colors
    white-space: nowrap
    width: 100%

  /* On focus */
  button:focus
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  /* On disabled */
  button:disabled
    border-color: colors.$input-disabled
    cursor: not-allowed
    filter: grayscale(.9) brightness(.9)

  .has-placeholder
    height: 3.5rem
    padding-top: 1.5rem

  .item
    line-height: 1.25rem
    overflow: hidden
    text-overflow: ellipsis

  .icons
    align-items: center
    display: flex
    gap: .25rem
    padding-left: .75rem
    padding-right: .75rem
    pointer-events: none
    position: absolute
    right: 0rem

  .chevron
    transition: transitions.$transform
</style>
