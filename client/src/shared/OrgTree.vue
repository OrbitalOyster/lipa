<script setup lang="ts">
import { faMagnifyingGlass, faSquareCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { refDebounced, useLocalStorage } from '@vueuse/core'
import GooseButton from '#components/GooseButton.vue'
import GooseInput from '#components/GooseInput.vue'
import GooseTree from '#components/GooseTree.vue'
import type { Ref } from 'vue'
import axios from 'axios'
import { ref } from 'vue'

/* TODO: Shared types */
interface ApiOrg {
  id: string
  name: string
  parent?: string
}

function toTree(arr: ApiOrg[], parent?: string): GooseTreeLeaf[] {
  return arr.filter(i => i.parent === parent).map((i) => {
    const result: GooseTreeLeaf = {
        title: `${i.id} - ${i.name}`,
        id: i.id,
        checked: useLocalStorage(`org-${i.id}-selected`, false),
        toggled: useLocalStorage(`org-${i.id}-toggled`, false),
      },
      sub: GooseTreeLeaf[] = toTree(arr, i.id)

    if (sub.length)
      result.sub = sub
    return result
  })
}

const search = ref(''),
  debounced = refDebounced(search, 500),
  checked = ref(false),
  axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
  axiosRes = await axiosInstance.get('/orgs'),
  apiOrgs: ApiOrg[] = axiosRes.data,
  orgs: Ref<GooseTreeLeaf[]> = ref(toTree(apiOrgs))

</script>

<template>
  <div class="sticky-bar">
    <div class="search-bar-wrapper">
      <GooseInput
        v-model="search"
        :icon="faMagnifyingGlass"
        style="flex-grow: 1"
      />
      <GooseButton
        :icon="faXmark"
        transparent
        tooltip="Toggle checks"
      />
      <GooseButton
        :icon="faSquareCheck"
        transparent
        tooltip="Toggle checks"
      />
    </div>
  </div>
  <GooseTree
    v-model="orgs"
    :checkable="true"
    :selectable="false"
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
    gap: .5rem
    justify-content: space-between
</style>
