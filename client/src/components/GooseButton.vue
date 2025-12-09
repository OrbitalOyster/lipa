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
    large?: boolean
    loading?: boolean
    round?: boolean
    submit?: boolean
    title?: string
    tooltip?: string
    tooltipSide?: Side
    transparent?: boolean
  }>(),
  type = props.submit ? 'submit' : 'button',
  emit = defineEmits(['click', 'blur']),
  classObject = computed(() => ({
    large: props.large,
    primary: props.color === 'primary' || (!props.color && !props.transparent),
    warning: props.color === 'warning',
    danger: props.color === 'danger',
    round: props.round,
    transparent: props.transparent,
  }))
</script>

<template>
  <div :class="{ inline }">
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
        <div
          v-if="icon || loading"
          class="icon"
        >
          <FontAwesomeIcon
            :class="loading && 'fa-pulse'"
            :icon="loading ? faSpinner : icon!"
          />
        </div>
      </button>
    </GooseTooltip>
  </div>
</template>

<style scoped lang="sass">
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

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
    font-family: inherit
    font-size: 1.25rem
    gap: .5rem
    justify-content: space-around
    min-height: 3.25rem
    min-width: 3.25rem
    outline: colors.$outline solid 0px
    padding-left: .75rem
    padding-right: .75rem
    transition: transitions.$focusable, transitions.$colors
    width: 100%

  .large
    font-size: xx-large
    min-height: 4rem
    min-width: 4rem

  .primary
    background-color: colors.$primary

  .primary:active
    background-color: colors.$active

  .warning
    background-color: colors.$warning

  .warning:active
    background-color: colors.$warning-active

  .danger
    background-color: colors.$danger

  .danger:active
    background-color: colors.$danger-active

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

  .transparent:active
    background-color: transparent

  .transparent:disabled
    background-color: transparent
    color: colors.$text-inactive
    cursor: not-allowed

  .round
    border-radius: 100%

  /* On hover */
  button:hover:not(:disabled)
    filter: brightness(1.1)

  /* On focus */
  button:focus
    outline-width: .25rem

  /* On disabled */
  button:disabled
    background-color: colors.$disabled-primary
    color: colors.$disabled
    cursor: not-allowed
</style>
