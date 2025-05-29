<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GoosePopover from '#components/GoosePopover.vue'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import type { Side } from '@floating-ui/core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
    danger?: boolean
    disabled?: boolean
    icon?: IconDefinition
    loading?: boolean
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
  <GoosePopover
    has-arrow
    :hover-toggle="!!tooltip"
    :side="tooltipSide"
  >
    <button
      :disabled
      :type
      :class="{ primary: !transparent, warning, danger, small, transparent }"
      :tabindex="transparent ? -1 : 0"
      @click="emit('click')"
    >
      {{ title }}
      <FontAwesomeIcon
        v-if="icon || loading"
        style="width: 2rem"
        :class="loading && 'fa-pulse'"
        :icon="loading ? faSpinner : icon!"
        size="xl"
      />
    </button>
    <template #popover>
      <div class="tooltip">
        {{ tooltip }}
      </div>
    </template>
  </GoosePopover>
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
    filter: drop-shadow(colors.$button-shadow 0 .125rem .125rem)
    font-family: inherit
    font-size: 1.25rem
    gap: .75rem
    height: 3.5rem
    outline: colors.$outline solid 0px
    padding-left: .75rem
    padding-right: .75rem
    transition: transitions.$focusable, transitions.$colors, transitions.$filter, transitions.$transform
    user-select: none

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

  /* On hover */
  button:hover
    filter: drop-shadow(colors.$button-shadow 0 .25rem .25rem)
    transform: translateY(-.0625rem)

  /* On focus */
  button:focus
    outline-width: .25rem

  /* On active */
  button:active
    filter: drop-shadow(colors.$button-shadow 0 .125rem .125rem)
    transform: translateY(0)

  /* On disabled */
  button:disabled
    color: colors.$disabled
    cursor: not-allowed
    filter: none
    transform: translateY(0)

  .tooltip
    padding: 1rem
    white-space: nowrap
</style>
