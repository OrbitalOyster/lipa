<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  disabled?: boolean
}>()

const model = defineModel<boolean | null>({ default: false }),
  emit = defineEmits(['update']),
  id = useId()
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
      @click.stop="model = !model; emit('update', model)"
    >
      <div
        class="mark"
        :style="{
          height: model === null ? '.4rem' : '1rem',
          scale: model === false ? '0%' : '100%',
          top: model === null ? '.8rem' : '.5rem'
        }"
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

  .wrapper
    align-items: center
    display: flex
    gap: .5rem

  input
    display: none

  button
    box-sizing: content-box
    min-height: 2rem
    padding: 0
    position: relative
    transition: transitions.$focusable, transitions.$colors
    min-width: 2rem

  button:active:enabled
    background-color: colors.$active

  .mark
    background-color: colors.$primary
    border-radius: borders.$radius
    left: .5rem
    position: absolute
    transition: height .1s ease-in-out, top .1s ease-in-out, scale .1s ease-in-out
    width: 1rem

  button:disabled .mark
    background-color: colors.$disabled-primary

  label
    user-select: none
</style>
