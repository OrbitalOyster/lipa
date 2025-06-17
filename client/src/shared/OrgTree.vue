<script setup lang="ts">
import { faHouse, faMagnifyingGlass, faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { ref, useTemplateRef } from 'vue'
import { refDebounced, useLocalStorage } from '@vueuse/core'
import GooseButton from '#components/GooseButton.vue'
import GooseInput from '#components/GooseInput.vue'
import GooseTree from '#components/GooseTree.vue'
import type { Ref } from 'vue'
import useFetchOrgs from '#composables/useFetchOrgs.ts'
import { useUserStore } from '#stores/useUserStore.ts'

/* Converts api array to object */
const toTree = (arr: ApiOrg[], parent?: string): TreeLeaf[] =>
  arr.filter(i => i.parent === parent).map(i => ({
    title: `${i.id} - ${i.name}`,
    id: i.id,
    toggled: useLocalStorage(`org-${i.id}-selected`, false),
    opened: useLocalStorage(`org-${i.id}-opened`, false),
    sub: toTree(arr, i.id),
  }))

const search = ref(''),
  debounced = refDebounced(search, 500),
  apiOrgs = await useFetchOrgs(),
  orgs: Ref<TreeLeaf[]> = ref(toTree(apiOrgs)),
  treeRef = useTemplateRef('tree'),
  orgId = useUserStore().orgId
</script>

<template>
  <div class="sticky-bar">
    <GooseInput
      v-model="search"
      :icon="faMagnifyingGlass"
    />
    <div class="select-buttons">
      <GooseButton
        title="Выбрать всех"
        :icon="faSquareCheck"
        @click="treeRef?.toggleAll(true)"
      />
      <GooseButton
        v-if="orgId"
        title="Выбрать себя"
        :icon="faHouse"
        @click="treeRef?.toggleSome([orgId], true)"
      />
      <GooseButton
        title="Сбросить"
        :icon="faSquare"
        @click="treeRef?.toggleAll(false)"
      />
    </div>
  </div>
  <GooseTree
    ref="tree"
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
    justify-content: space-around
    gap: 1rem
</style>
