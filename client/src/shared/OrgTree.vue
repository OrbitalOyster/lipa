<script setup lang="ts">
import GooseTreeRoot from '#components/GooseTreeRoot.vue'
import type { Ref } from 'vue'
import axios from 'axios'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

function toTree(arr: ApiOrg[], parent?: string): GooseTreeLeaf[] {
  return arr.filter(i => i.parent === parent).map((i) => {
    const result: GooseTreeLeaf = {
        title: `${i.id} - ${i.name}`,
        id: i.id,
        checked: false,
        toggled: useLocalStorage(`org-${i.id}-toggled`, false),
      },
      checked = useLocalStorage(`org-${i.id}-selected`),
      sub: GooseTreeLeaf[] = toTree(arr, i.id)

/*
    switch (checked) {
      case 'true':
        sub.checked = true
        break
      case 'false':
        sub.checked = false
        break
      default:
        sub.checked = 'indeterminate'
        break
    }
*/

    if (sub.length)
      result.sub = sub
    return result
  })
}

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
  res = await axiosInstance.get('/orgs'),
  apiOrgs: ApiOrg[] = res.data,
  orgs: Ref<GooseTreeLeaf[]> = ref(toTree(apiOrgs))

/* TODO: Shared types */
interface ApiOrg {
  id: string
  name: string
  parent?: string
}

</script>

<template>
  <GooseTreeRoot
    v-model="orgs"
    :searchable="true"
    :checkable="true"
  />
</template>
