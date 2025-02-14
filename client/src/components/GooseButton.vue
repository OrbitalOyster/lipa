<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GoosePopover from '#components/GoosePopover.vue'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import type { Placement } from '@floating-ui/utils'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
    disabled?: boolean
    icon?: IconDefinition
    loading?: boolean
    small?: boolean
    submit?: boolean
    title?: string
    tooltip?: string
    tooltipPlacement?: Placement
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
    :placement="tooltipPlacement"
  >
    <button
      :disabled
      :type
      class="focusable"
      :class="{ primary: !transparent, warning, small, transparent }"
      :tabindex="transparent ? -1 : 0"
      @click="emit('click')"
    >
      {{ title }}
      <FontAwesomeIcon
        v-if="icon || loading"
        style="width: 2rem"
        :class="{ 'fa-pulse': loading }"
        :icon="loading ? faSpinner : icon!"
        size="xl"
      />
    </button>
    <template #popover>
      <div style="padding: 1rem; white-space: nowrap">
        {{ tooltip }}
      </div>
    </template>
  </GoosePopover>
</template>

<style scoped lang="sass">
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  .primary
    background-color: colors.$primary

  .primary:active:enabled
    background-color: colors.$active

  .warning
    background-color: colors.$warning

  .warning:active:enabled
    background-color: colors.$warning-active

  .alert
    background-color: colors.$alert

  .alert:active:enabled
    background-color: colors.$alert

  .transparent:enabled, .transparent:active
    background-color: transparent
    color: colors.$text
    outline: none
    padding-left: 0rem
    padding-right: 0rem

  .transparent:disabled
    background-color: transparent
    color: colors.$text-inactive
    cursor: not-allowed
    outline: none
    padding-left: 0rem
    padding-right: 0rem

  .small
    height: 3rem
    padding-left: .5rem
    padding-right: .5rem

  button
    align-items: center
    border-radius: borders.$radius
    border: none
    color: colors.$button
    cursor: pointer
    display: inline-flex
    filter: drop-shadow(colors.$button-shadow 0 0 .1rem)
    font-size: 1.25rem
    font-weight: 500
    gap: .8rem
    height: 3.5rem
    padding-left: .8rem
    padding-right: .8rem
    transform: translateY(0)
    transition: transitions.$focusable, transitions.$colors, transitions.$filter, transitions.$transform
    user-select: none

  button:enabled
    filter: drop-shadow(colors.$button-shadow 0 .16rem .1rem)

  button:hover:enabled
    filter: drop-shadow(colors.$button-shadow 0 .28rem .2rem)
    transform: translateY(-.1rem)

  button:active:enabled
    filter: drop-shadow(colors.$button-shadow 0 .16rem .1rem)
    transform: translateY(0)

  button:disabled
    background-color: colors.$disabled-primary
    color: colors.$disabled
    cursor: not-allowed
</style>
