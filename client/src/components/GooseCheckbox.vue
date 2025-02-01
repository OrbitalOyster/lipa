<script setup lang="ts">
import { nextTick } from 'vue'

defineProps<{
  disabled?: boolean
  name: string
  title?: string
}>()

const model = defineModel<boolean | null>({ default: false }),
  emit = defineEmits(['update'])

async function onClick() {
  model.value = !model.value
  await nextTick() /* Gotta wait for DOM */
  emit('update', model.value)
}
</script>

<template>
  <input
    v-model="model"
    :name
    type="checkbox"
  >
  <div style="align-items: center; display: flex; gap: .5rem">
    <button
      :id="name"
      :disabled
      class="focusable form-input"
      type="button"
      @click.stop="onClick"
    >
      <span
        class="mark"
      />
    </button>
    <label
      v-if="title"
      :for="name"
    >
      {{ title }}
    </label>
  </div>
</template>

<style scoped lang="sass">
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  input
    display: none

  button
    box-sizing: content-box
    cursor: pointer
    height: 2rem
    padding: 0
    position: relative
    transition: transitions.$focusable, transitions.$colors
    width: 2rem

  button:active:enabled
    background-color: colors.$active

  .mark
    background-color: colors.$primary
    border-radius: borders.$radius
    height: v-bind("model === null ? '.4rem' : '1rem'")
    left: .5rem
    position: absolute
    top: v-bind("model === null ? '.8rem' : '.5rem'")
    width: 1rem
    transition: height .1s ease-in-out, top .1s ease-in-out, scale .1s ease-in-out
    scale: v-bind("model === false ? '0%' : '100%'")

  button:disabled .mark
    background-color: colors.$disabled-primary

  label
    cursor: pointer
    user-select: none
</style>
