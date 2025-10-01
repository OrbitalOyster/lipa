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
    small?: boolean
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
      :class="{ primary: !transparent, warning, danger, round, small, transparent }"
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
          class="fa-fw"
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
    border-color: colors.$outline
    border-radius: borders.$radius
    border: none
    color: colors.$button
    cursor: pointer
    display: inline-flex
    filter: drop-shadow(colors.$button-shadow 0 .1rem .1rem)
    font-family: inherit
    font-size: 1.25rem
    gap: .75rem
    min-height: 3rem
    min-width: 3rem
    margin: borders.$focus-outline-width
    outline: colors.$outline solid 0px
    transition: transitions.$focusable, transitions.$colors, transitions.$filter
    justify-content: space-around
    padding: .5rem

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
    outline: none
    padding-left: 0
    padding-right: 0

  .transparent:disabled
    color: colors.$text-inactive
    cursor: not-allowed

  .small
    height: 3rem
    padding-left: .5rem
    padding-right: .5rem

  .round
    border-radius: 100%

  /* On hover */
  button:hover
    filter: drop-shadow(colors.$button-shadow 0 .2rem .2rem)

  /* On focus */
  button:focus
    outline-width: .25rem

  /* On disabled */
  button:disabled
    color: colors.$disabled
    cursor: not-allowed
    filter: none
</style>
