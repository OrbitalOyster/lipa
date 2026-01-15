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
          :class="['icon', loading && 'fa-pulse']"
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
  @use '../assets/filters'
  @use '../assets/transitions'
  @use '../assets/sizings'

  .button-wrapper
    border-radius: borders.$radius
    outline: colors.$outline solid 0px
    transition: transitions.$focusable

    &.inline
      display: inline-flex

    &:has(button:focus):not(:has(.transparent))
      outline-width: borders.$focus-outline-width

  button
    align-items: center
    border-radius: borders.$radius
    border: none
    color: colors.$button-title
    cursor: pointer
    display: flex
    justify-content: space-around
    gap: sizings.$button-padding
    min-height: sizings.$input-min-height
    min-width: sizings.$input-min-width
    outline: none
    transition: transitions.$filter
    width: 100%

    &:has(.title)
      padding: sizings.$button-padding

    &:hover
      filter: filters.$hover

    &:active
      filter: filters.$active

    &:disabled
      cursor: not-allowed
      filter: filters.$disabled

    .title
      font-size: sizings.$button-font-size

  .round
    border-radius: 100%

  .primary
    background-color: colors.$primary

  .warning
    background-color: colors.$warning

  .danger
    background-color: colors.$danger

  /* Transparent buttons */
  .transparent
    background-color: transparent
    color: colors.$text
    min-height: 0px
    min-width: 0px
    padding: 0px

    &.primary
      .title, .icon
        color: colors.$primary

    &.warning
      .title, .icon
        color: colors.$warning

    &.danger
      .title, .icon
        color: colors.$danger
</style>
