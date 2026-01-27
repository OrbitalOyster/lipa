<script setup lang="ts">
import { faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { ref, useTemplateRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseErrorIcon from '@/components/GooseErrorIcon.vue'
import GoosePlaceholder from '@/components/parts/GoosePlaceholder.vue'
import GoosePopupMenu from '@/components/GoosePopupMenu.vue'
import type { Side } from '@floating-ui/core'
import { useElementSize } from '@vueuse/core'

const props = defineProps<{
    autofocus?: boolean
    checks?: FormCheck[]
    disabled?: boolean
    disabledOnLoading?: boolean
    error?: string
    items: SelectItem[]
    loading?: boolean
    placeholder?: string
    side?: Side
  }>(),
  icons = useTemplateRef('icons'),
  emit = defineEmits(['update']),
  active = ref(false),
  selectedId = defineModel<SelectId>({ required: true })

/* Icons width */
const { width } = useElementSize(
  icons,
  { width: 0, height: 0 },
  { box: 'border-box' },
)

const update = (newId: SelectId) => {
  if (newId === selectedId.value)
    return
  selectedId.value = newId
  emit('update', newId)
}

const keyScroll = (direction: -1 | 1) => {
  let selectedIndex = props.items.findIndex(i => i.id === selectedId.value)
  /* Edge case - nothing selected */
  if (selectedIndex === -1)
    selectedIndex = direction > 0 ? -1 : 0
  /* Wrap around items */
  selectedIndex = (selectedIndex + direction + props.items.length)
    % props.items.length
  update(props.items[selectedIndex]!.id)
}
</script>

<template>
  <div>
    <GoosePopupMenu
      v-model="selectedId"
      :active
      :fit-target-width="true"
      :items
      :show-selected="true"
      :side
      @update="newId => { active = false; update(newId) }"
    >
      <div class="select-wrapper">
        <!-- Pseudo-input -->
        <button
          type="button"
          :autofocus
          :class="{ invalid: error, valid: !error }"
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
        <GoosePlaceholder
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
  @use '@/assets/borders'
  @use '@/assets/colors'
  @use '@/assets/filters'
  @use '@/assets/sizings'
  @use '@/assets/transitions'

  .select-wrapper
    align-items: center
    display: flex
    position: relative

  button
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: borders.$form-input
    color: colors.$text
    cursor: pointer
    display: flex
    height: sizings.$input-height
    outline: colors.$outline solid 0px
    padding-left: sizings.$padding
    transition: transitions.$focusable, transitions.$colors, transitions.$filter
    white-space: nowrap
    width: 100%

    &:focus
      border-color: colors.$outline
      outline-width: borders.$focus-outline-width

    &:disabled
      border-color: colors.$input-disabled
      cursor: not-allowed
      filter: filters.$disabled

    /* Has placeholder */
    &:has(~label)
      height: sizings.$input-has-placeholder-height
      padding-top: sizings.$input-has-placeholder-padding-top

    &>.item
      align-content: center
      overflow: hidden
      text-overflow: ellipsis

  .icons
    align-items: center
    display: flex
    gap: sizings.$icons-gaps
    padding-left: sizings.$padding
    padding-right: sizings.$padding
    pointer-events: none
    position: absolute
    right: 0px

  .chevron
    transition: transitions.$transform
</style>
