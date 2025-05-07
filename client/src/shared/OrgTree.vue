<script setup lang="ts">
import GooseTreeRoot from '#components/GooseTreeRoot.vue'
import type { Ref } from 'vue'
import axios from 'axios'
import { ref } from 'vue'


function toTree(arr: ApiOrg[], parent?: string): GooseTreeLeaf[] | null {
  const filtered = arr.filter(i => i.parent === parent)
  return filtered.length
    ? filtered.map(i => (
        {
          title: `${i.id} - ${i.name}`,
          id: i.id,
          checked: false,
          // checked: useLocalStorage(`org-${i.id}-selected`, false).value,
          toggled: false,
          // toggled: useLocalStorage(`org-${i.id}-toggled`, false),
          sub: toTree(arr, i.id) ?? undefined, /* TODO: Lunacy */
        }
      ))
    : null
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
