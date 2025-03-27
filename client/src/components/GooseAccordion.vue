<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

interface AccordionItem {
  id: string
  title: string
  icon: IconDefinition
}

interface Accordion {
  items: AccordionItem[]
  toggled: string
}

const model = defineModel<Accordion>({ required: true })
</script>

<template>
  <ul>
    <li
      v-for="item in model.items"
      :key="item.id"
      :class="{ card: true, toggled: model.toggled === item.id }"
    >
      <div
        class="title"
        @click="model.toggled = model.toggled === item.id ? '' : item.id"
      >
        <div style="display: flex; align-items: center">
          <div class="icon">
            <FontAwesomeIcon
              :icon="item.icon"
              size="lg"
            />
          </div>
          <h1>
            {{ item.title }}
          </h1>
        </div>
        <FontAwesomeIcon
          class="chevron"
          :icon="faChevronDown"
          size="xl"
          :style="{ transform: model.toggled === item.id ? 'rotate(180deg)' : 'none'}"
        />
      </div>
      <div class="item-container">
        <slot :name="item.id" />
      </div>
    </li>
  </ul>
</template>

<style lang="sass" scoped>
  @use '../assets/transitions'

  ul
    display: flex
    flex-direction: column
    height: 100%
    margin: 0
    padding: 0

  li
    display: flex
    flex-direction: column
    flex-grow: 0
    height: 3rem
    margin-bottom: .25rem
    margin-top: .25rem
    overflow: hidden
    transition: 50ms flex-grow ease-in-out

  li.toggled
    flex-grow: 1

  .title
    align-items: center
    cursor: pointer
    display: flex
    flex-shrink: 0
    height: 3rem
    justify-content: space-between
    padding-left: .5rem
    padding-right: .5rem
    user-select: none

  .chevron
    transition: transitions.$transform

  .icon
    display: inline-flex
    justify-content: center
    width: 1.5rem

  h1
    font-size: 1rem
    font-weight: normal
    margin: 0
    padding: 0

  .item-container
    overflow: auto
    height: 100%
</style>
