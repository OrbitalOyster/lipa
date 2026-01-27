<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useElementSize, useFocus } from '@vueuse/core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseErrorIcon from '@/components/GooseErrorIcon.vue'
import GoosePlaceholder from '@/components/parts/GoosePlaceholder.vue'
import GooseTogglePassword from '@/components/GooseTogglePassword.vue'
import GooseTooltip from '@/components/GooseTooltip.vue'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import type { Side } from '@floating-ui/core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

defineProps<{
  autocomplete?: string
  autofocus?: boolean
  disabled?: boolean
  disabledOnLoading?: boolean
  error?: string
  icon?: IconDefinition
  loading?: boolean
  password?: boolean
  placeholder?: string
  tooltip?: string
  tooltipSide?: Side
}>()

const text = defineModel<string>({ required: true }),
  emit = defineEmits(['input', 'blur', 'keydown']),
  input = useTemplateRef('input'),
  icons = useTemplateRef('icons'),
  passwordHidden = ref(true),
  { focused } = useFocus(input),
  focus = () => focused.value = true,
  blur = () => focused.value = false,
  selectAll = () => input.value?.select()

/* Icons width */
const iconsWidth = useElementSize(
  icons,
  { width: 0, height: 0 },
  { box: 'border-box' },
).width

defineExpose({ focus, blur, selectAll })
</script>

<template>
  <div>
    <GooseTooltip
      :side="tooltipSide"
      :text="tooltip"
    >
      <div class="input-wrapper">
        <!-- Actual input -->
        <input
          ref="input"
          v-model="text"
          :autocomplete
          :autofocus
          :class="{ invalid: error, valid: !error, 'has-placeholder': !!placeholder }"
          :disabled="disabled || disabledOnLoading && loading"
          :style="{ paddingRight: iconsWidth + 'px' }"
          :type="password && passwordHidden ? 'password' : 'text'"
          @input="emit('input')"
          @blur="emit('blur')"
          @keydown="e => emit('keydown', e)"
        >
        <!-- Placeholder -->
        <GoosePlaceholder
          v-if="placeholder"
          :active="focused || text !== ''"
          :style="{ width: `calc(100% - ${iconsWidth}px - .75rem)` }"
          :title="placeholder"
        />
        <div
          ref="icons"
          class="icons"
        >
          <!-- Validation icon -->
          <GooseErrorIcon
            v-if="error"
            :message="error"
          />
          <!-- Loading icon -->
          <FontAwesomeIcon
            v-if="loading"
            class="fa-pulse"
            :icon="faSpinner"
            size="xl"
          />
          <!-- Custom icon -->
          <FontAwesomeIcon
            v-if="icon"
            :icon
          />
          <!-- Password show/hide icon -->
          <GooseTogglePassword
            v-if="password"
            v-model="passwordHidden"
            small
            :disabled
          />
        </div>
      </div>
    </GooseTooltip>
  </div>
</template>

<style lang="sass" scoped>
  @use '@/assets/borders'
  @use '@/assets/colors'
  @use '@/assets/filters'
  @use '@/assets/sizings'
  @use '@/assets/transitions'

  .input-wrapper
    align-items: center
    display: flex
    position: relative

  /* Base */
  input
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: borders.$form-input
    box-sizing: border-box
    color: colors.$text
    height: sizings.$input-height
    min-width: sizings.$min-width
    outline: colors.$outline solid 0px
    overflow: hidden
    padding-left: sizings.$padding
    text-overflow: ellipsis
    transition: transitions.$focusable, transitions.$colors, transitions.$filter
    width: 100%

    &:focus
      border-color: colors.$outline
      outline-width: borders.$focus-outline-width

    &:disabled
      border-color: colors.$input-disabled
      cursor: not-allowed
      filter: filters.$disabled

    &:has(~label)
      height: sizings.$input-has-placeholder-height
      padding-top: sizings.$input-has-placeholder-padding-top

  .icons
    align-items: center
    display: flex
    gap: sizings.$icons-gaps
    padding-left: sizings.$padding
    padding-right: sizings.$padding
    pointer-events: none
    position: absolute
    right: 0px
</style>
