<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'

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
      :class="{selected: slot.id === selected}"
      @click="selected = slot.id"
    >
      <h1>
        <FontAwesomeIcon
          :icon="slot.icon"
          size="lg"
        />
        <span>{{ slot.title }}</span>
      </h1>
    </li>
  </ul>
  <div class="content">
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
    height: 3rem
  
  li
    background-color: white
    border-radius: borders.$radius
    border: borders.$card-inactive

    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
    border-bottom: none

    color: colors.$text-inactive
    cursor: pointer
    display: flex
    margin-top: 1rem
    padding: .5rem
    position: relative
    transition: margin 100ms ease-in-out, transform 100ms ease-in-out
    user-select: none
    white-space: nowrap
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)

  li.selected
    border: borders.$card
    border-bottom: none
    color: colors.$text
    margin-top: 0
    /* transform: translate(0, borders.$radius) */

  h1
    display: flex
    font-size: 1rem
    font-weight: normal
    gap: .5rem
    margin: 0
    padding: 0

  .content
    background-color: colors.$card
    border-radius: borders.$radius
    border: borders.$card
    display: flex
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)
    height: 100%

</style>
