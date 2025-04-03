<script setup lang="ts">
import GooseButton from '#components/GooseButton.vue'
import GooseInput from '#components/GooseInput.vue'
import GooseTree from '#components/GooseTree.vue'
import type { GooseTreeLeaf } from '#components/GooseTree.vue'
import { faCheckDouble, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'
import { refDebounced } from '@vueuse/core'

defineProps<{
  checkable?: boolean
  searchable?: boolean
}>()

const checked = ref(false),
  search = ref(''),
  debounced = refDebounced(search, 500),
  model = defineModel<GooseTreeLeaf[]>({ required: true })
</script>

<template>
  <div class="sticky-bar">
    <div class="search-bar-wrapper">
      <GooseInput
        v-if="searchable"
        v-model="search"
        :icon="faMagnifyingGlass"
        style="flex-grow: 1"
      />
      <GooseButton
        :icon="faCheckDouble"
        transparent
        tooltip="Toggle checks"
      />
    </div>
  </div>
  <GooseTree
    v-model="model"
    :checkable
    :checked="checked || false"
    :search="debounced"
    style="padding-left: 0"
    @select="e => console.log(`selected ${e}`)"
  />
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'

  .sticky-bar
    box-sizing: border-box
    height: fit-content
    padding: .5rem
    position: sticky
    top: 0
    width: 100%
    z-index: 10

    /* TODO: Separate class */
    background-color: colors.$card
    border-bottom-left-radius: borders.$radius
    border-bottom-right-radius: borders.$radius
    border-bottom: borders.$card
    border-top-left-radius: 0
    border-top-right-radius: 0
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)
    margin-bottom: .25rem

  .search-bar-wrapper
    display: flex
    gap: 1rem
    justify-content: space-between

</style>
