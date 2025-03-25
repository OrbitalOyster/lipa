<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { ref } from 'vue'

interface TabSlot {
  id: string
  title: string
  icon: IconDefinition
}

const props = defineProps<{
  slots: TabSlot[]
}>()

/* No slots? */
if (!props.slots[0])
  throw new Error('Major screwup')

const selected = ref(props.slots[0].id)
</script>

<template>
  <ul>
    <li
      v-for="slot in slots"
      :key="slot.id"
      class=""
      :class="{'selected': slot.id === selected}"
      @click="selected = slot.id"
    >
      <h1>
        <FontAwesomeIcon
          :icon="slot.icon"
          size="lg"
          style="width: 2rem"
        />
        <span>{{ slot.title }}</span>
      </h1>
    </li>
  </ul>
  <div
    class="card"
    style="height: 100%"
  >
    <div
      v-for="slot in slots"
      :key="slot.id"
    >
      <div v-if="slot.id === selected">
        <slot :name="slot.id" />
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'
  @use '../assets/borders'

  ul
    display: flex
    flex-direction: row
    margin: 0
    padding: 0
    z-index: 1

  li
    background-color: white
    border-radius: borders.$radius
    border: borders.$card-inactive

    border-bottom: none
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0

    color: colors.$text-inactive
    cursor: pointer
    display: flex
    margin-top: 1rem
    padding: .5rem
    position: relative
    transition: margin 100ms ease-in-out, transform 100ms ease-in-out
    user-select: none
    white-space: nowrap

  li.selected
    border: borders.$card
    border-bottom: none
    color: colors.$text
    margin-top: 0
    transform: translate(0, borders.$radius)
    z-index: 2

  h1
    font-size: 1rem
    font-weight: normal
    margin: 0
    padding: 0
</style>
