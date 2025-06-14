<script setup lang="ts">
import { faMagnifyingGlass, faSquareCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { refDebounced, useLocalStorage } from '@vueuse/core'
import GooseButton from '#components/GooseButton.vue'
import GooseInput from '#components/GooseInput.vue'
import GooseTree from '#components/GooseTree.vue'
import type { Ref } from 'vue'
import { ref } from 'vue'
import useFetchOrgs from '#composables/useFetchOrgs.ts'

/* Converts api array to object */
const toTree = (arr: ApiOrg[], parent?: string): TreeLeaf[] =>
  arr.filter(i => i.parent === parent).map(i => ({
    title: `${i.id} - ${i.name}`,
    id: i.id,
    checked: useLocalStorage(`org-${i.id}-selected`, false),
    opened: useLocalStorage(`org-${i.id}-opened`, false),
    sub: toTree(arr, i.id),
  }))

const search = ref(''),
  debounced = refDebounced(search, 500),
  apiOrgs = await useFetchOrgs(),
  orgs: Ref<TreeLeaf[]> = ref(toTree(apiOrgs))
</script>

<template>
  <div class="sticky-bar">
    <GooseInput
      v-model="search"
      :icon="faMagnifyingGlass"
      style="flex-grow: 1"
    />
    <div class="select-buttons">
      <GooseButton
        title="Select all"
        :icon="faSquareCheck"
      />
      <GooseButton
        title="Select none"
      />
    </div>
  </div>
  <GooseTree
    v-model="orgs"
    :search="debounced"
    style="padding-left: 0"
  />
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'

  .sticky-bar
    box-sizing: border-box
    display: flex
    flex-direction: column
    gap: .5rem
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

  .select-buttons
    display: flex
    justify-content: space-between
    gap: 1rem
</style>
