<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'

interface AccordionItem {
  id: string
  title: string
  icon: IconDefinition
}

const model = defineModel<AccordionItem[]>(),
  toggled = ref('')
</script>

<template>
  <ul>
    <li
      v-for="item in model"
      :key="item.id"
      :class="{ card: true, toggled: toggled === item.id }"
    >
      <div
        class="title"
        @click="toggled = toggled === item.id ? '' : item.id"
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
          :style="{ transform: toggled === item.id ? 'rotate(180deg)' : 'none'}"
        />
      </div>
      <div
        v-if="item.title === toggled"
        class="item-container"
      >
        <slot :name="item.id" />
      </div>
    </li>
  </ul>
</template>

<style lang="sass" scoped>
  @use '../assets/transitions'

  ul
    padding: 0
    margin: 0
    display: flex
    flex-direction: column
    height: 100%

  li
    overflow: hidden
    transition: 100ms flex-grow ease-in-out
    flex-grow: 0
    margin-top: .25rem
    margin-bottom: .25rem

  li.toggled
    flex-grow: 1

  .title
    display: flex
    justify-content: space-between
    align-items: center
    cursor: pointer
    user-select: none
    height: 3rem
    padding-right: .5rem

  .chevron
    transition: transitions.$transform

  .icon
    display: inline-flex
    width: 2rem
    justify-content: center

  h1
    padding: 0
    margin: 0
    font-weight: normal
    font-size: 1rem

  .item-container
    overflow: auto
    height: 100%
</style>
