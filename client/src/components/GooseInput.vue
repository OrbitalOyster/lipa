<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useElementSize, useFocus } from '@vueuse/core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseErrorIcon from '#components/GooseErrorIcon.vue'
import GooseInputPlaceholder from '#components/GooseInputPlaceholder.vue'
import GooseTogglePassword from '#components/GooseTogglePassword.vue'
import GooseTooltip from '#components/GooseTooltip.vue'
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
  emit = defineEmits(['input', 'blur', 'keydown', 'esc', 'enter']),
  input = useTemplateRef('input'),
  icons = useTemplateRef('icons'),
  passwordHidden = ref(true),
  { focused } = useFocus(input),
  focus = () => focused.value = true,
  blur = () => focused.value = false,
  selectAll = () => input.value?.select()

/* Icons width */
const { width } = useElementSize(icons, { width: 0, height: 0 }, { box: 'border-box' })

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
          :style="{ paddingRight: width + 'px' }"
          :type="password && passwordHidden ? 'password' : 'text'"
          @input="emit('input')"
          @blur="emit('blur')"
          @keydown="e => emit('keydown', e)"
          @keydown.esc="emit('esc')"
          @keydown.enter="emit('enter')"
        >
        <!-- Placeholder -->
        <GooseInputPlaceholder
          v-if="placeholder"
          class="placeholder"
          :active="focused || text !== ''"
          :style="{ width: `calc(100% - ${width}px - .75rem)` }"
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
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  .input-wrapper
    align-items: center
    display: flex
    position: relative

  /* Base */
  input
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: 1px solid colors.$input-border
    box-sizing: border-box
    color: colors.$text
    font: inherit
    height: 2.5rem
    min-width: 3.25rem
    outline: colors.$outline solid 0px
    overflow: hidden
    padding-bottom: .25rem
    padding-left: .75rem
    padding-top: .25rem
    text-overflow: ellipsis
    transition: transitions.$focusable, transitions.$colors
    width: 100%

  /* On focus */
  input:focus
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  /* On disabled */
  input:disabled
    background-color: colors.$input-disabled
    border-color: colors.$input-disabled
    color: colors.$disabled-primary
    cursor: not-allowed

  .has-placeholder
    height: 3.5rem
    padding-top: 1.25rem

  .icons
    align-items: center
    display: flex
    gap: .25rem
    padding-left: .75rem
    padding-right: .75rem
    pointer-events: none
    position: absolute
    right: 0rem
</style>
