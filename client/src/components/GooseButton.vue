<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseTooltip from '#components/GooseTooltip.vue'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import type { Side } from '@floating-ui/core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
    danger?: boolean
    disabled?: boolean
    icon?: IconDefinition
    loading?: boolean
    round?: boolean
    submit?: boolean
    title?: string
    tooltip?: string
    tooltipSide?: Side
    transparent?: boolean
    warning?: boolean
  }>(),
  type = props.submit ? 'submit' : 'button',
  emit = defineEmits(['click'])
</script>

<template>
  <GooseTooltip
    :side="tooltipSide"
    :text="tooltip"
  >
    <button
      :disabled
      :type
      :class="{ primary: !transparent, warning, danger, round, transparent }"
      :tabindex="transparent ? -1 : 0"
      @click="emit('click')"
    >
      <span
        v-if="title"
        class="title"
      >
        {{ title }}
      </span>
      <span
        v-if="icon || loading"
        class="icon"
      >
        <FontAwesomeIcon
          :class="loading && 'fa-pulse'"
          :icon="loading ? faSpinner : icon!"
        />
      </span>
    </button>
  </GooseTooltip>
</template>

<style scoped lang="sass">
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  /* Base */
  button
    align-items: center
    border-radius: borders.$radius
    border: none
    color: colors.$button
    cursor: pointer
    display: inline-flex
    filter: drop-shadow(colors.$button-shadow 0 .1rem .1rem)
    font-family: inherit
    font-size: 1.25rem
    gap: .5rem
    justify-content: space-around
    margin: borders.$focus-outline-width
    min-height: 3.25rem
    min-width: 3.25rem
    outline: colors.$outline solid 0px
    padding-left: .75rem
    padding-right: .75rem
    transition: transitions.$focusable, transitions.$colors, transitions.$filter

  span.title
    display: flex

  span.icon
    display: flex

  .primary
    background-color: colors.$primary

  .primary:active
    background-color: colors.$active

  .primary:disabled
    background-color: colors.$disabled-primary

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

  .transparent:disabled
    color: colors.$text-inactive
    cursor: not-allowed

  .round
    border-radius: 100%

  /* On hover */
  button:hover
    filter: drop-shadow(colors.$button-shadow 0 .15rem .15rem)

  /* On focus */
  button:focus
    outline-width: .25rem

  /* On disabled */
  button:disabled
    color: colors.$disabled
    cursor: not-allowed
    filter: none
</style>
