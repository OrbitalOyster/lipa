<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

const model = defineModel<Accordion>({ required: true })
</script>

<template>
  <ul>
    <li
      v-for="item in model.items"
      :key="item.id"
      :class="{ toggled: model.toggled === item.id }"
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
          :class="model.toggled === item.id && 'chevron-toggled'"
          :icon="faChevronDown"
          size="xl"
        />
      </div>
      <div class="item-container">
        <slot :name="item.id" />
      </div>
    </li>
  </ul>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  ul
    display: flex
    flex-direction: column
    height: 100%

  li
    background-color: colors.$card
    border-radius: borders.$radius
    border: borders.$card
    display: flex
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)
    flex-direction: column
    flex-grow: 0
    height: 3rem
    margin-bottom: .25rem
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

  .chevron-toggled
    transform: rotate(180deg)

  .icon
    display: inline-flex
    justify-content: center
    width: 1.5rem

  h1
    font-size: 1rem
    font-weight: normal

  .item-container
    overflow: auto
</style>
