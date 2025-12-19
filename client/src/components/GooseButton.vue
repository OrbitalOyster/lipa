<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseTooltip from '#components/GooseTooltip.vue'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import type { Side } from '@floating-ui/core'
import { computed } from 'vue'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

type ButtonColor = 'primary' | 'warning' | 'danger'

const props = defineProps<{
    color?: ButtonColor
    disabled?: boolean
    disabledOnLoading?: boolean
    icon?: IconDefinition
    inline?: boolean
    loading?: boolean
    round?: boolean
    small?: boolean
    submit?: boolean
    title?: string
    tooltip?: string
    tooltipSide?: Side
    transparent?: boolean
  }>(),
  type = props.submit ? 'submit' : 'button',
  emit = defineEmits(['click', 'blur']),
  classObject = computed(() => ({
    primary: props.color === 'primary' || (!props.color && !props.transparent),
    warning: props.color === 'warning',
    danger: props.color === 'danger',
    round: props.round,
    transparent: props.transparent,
  }))
</script>

<template>
  <div
    class="button-wrapper"
    :class="{ inline }"
  >
    <GooseTooltip
      :side="tooltipSide"
      :text="tooltip"
    >
      <button
        :disabled="disabled || loading && disabledOnLoading"
        :type
        :class="classObject"
        :tabindex="transparent ? -1 : 0"
        @click="emit('click')"
        @blur="emit('blur')"
      >
        <div
          v-if="title"
          class="title"
        >
          {{ title }}
        </div>
        <FontAwesomeIcon
          v-if="icon || loading"
          :class="loading && 'fa-pulse'"
          :icon="loading ? faSpinner : icon!"
          :size="small ? 'xl' : '2xl'"
        />
      </button>
    </GooseTooltip>
  </div>
</template>

<style scoped lang="sass">
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'
  @use '../assets/sizings'

  .button-wrapper
    border-radius: borders.$radius
    outline: colors.$outline solid 0
    transition: transitions.$focusable

  /* On focus */
  .button-wrapper:has(button:focus)
    outline-width: .25rem

  .inline
    display: inline-flex

  /* Base */
  button
    align-items: center
    border-radius: borders.$radius
    border: none
    color: colors.$button
    cursor: pointer
    display: flex
    gap: .5rem
    justify-content: space-around
    min-height: sizings.$input-min-height
    min-width: sizings.$input-min-width
    transition: transitions.$focusable, transitions.$filter
    width: 100%

  button:has(.title)
    padding-left: 1rem
    padding-right: 1rem

  /* On hover */
  button:hover
    filter: brightness(1.1)

  /* On focus */
  button:focus
    outline: none

  /* On active */
  button:active
    filter: brightness(.9)

  /* On disabled */
  button:disabled
    cursor: not-allowed
    filter: grayscale(.8) brightness(.8)

  .title
    font-size: 1.25rem

  .primary
    background-color: colors.$primary

  .warning
    background-color: colors.$warning

  .danger
    background-color: colors.$danger

  .transparent
    background-color: transparent
    color: colors.$text
    min-height: 0
    min-width: 0
    outline: none
    padding-left: 0
    padding-right: 0

  .transparent.primary
    color: colors.$primary

  .transparent.warning
    color: colors.$warning

  .transparent.danger
    color: colors.$danger

  .round
    border-radius: 100%
</style>
