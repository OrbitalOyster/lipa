<script setup lang="ts">
import { useId, watch } from 'vue'

defineProps<{
  disabled?: boolean
}>()

const model = defineModel<boolean | null>({ default: false }),
  emit = defineEmits(['update']),
  id = useId()

watch(model, (newValue) => {
  emit('update', newValue)
})
</script>

<template>
  <input
    v-model="model"
    type="checkbox"
  >
  <div class="wrapper">
    <button
      :id
      :disabled
      :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
      class="focusable form-input"
      type="button"
      @click.stop="model = !model"
    >
      <div
        class="mark"
        :class="{ partially: model === null, checked: model !== false }"
      />
    </button>
    <label
      :for="id"
      :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
    >
      <slot />
    </label>
  </div>
</template>

<style scoped lang="sass">
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  /* Checkbox sizings */
  $button-size: 2rem
  $mark-size: 1rem
  $mark-partial-height: .5rem

  .wrapper
    align-items: center
    display: flex
    gap: .5rem

  input
    display: none

  button
    box-sizing: content-box
    height: $button-size
    padding: 0
    position: relative
    transition: transitions.$focusable, transitions.$colors
    width: $button-size

  button:active:enabled
    background-color: colors.$active

  .mark
    background-color: colors.$primary
    border-radius: borders.$radius
    height: $mark-size
    left: calc(($button-size - $mark-size) / 2)
    position: absolute
    scale: 0%
    top: calc(($button-size - $mark-size) / 2)
    transition: height .1s ease-in-out, top .1s ease-in-out, scale .1s ease-in-out
    width: $mark-size

  .checked
    scale: 100%

  .partially
    height: $mark-partial-height
    top: calc(($button-size - $mark-partial-height) / 2)

  button:disabled .mark
    background-color: colors.$disabled-primary

  label
    user-select: none
</style>
