<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'
import { Pane, Splitpanes } from 'splitpanes'
import { faBuilding, faClipboard, faClipboardList, faFileExcel, faPencil, faUpload } from '@fortawesome/free-solid-svg-icons'
import { onMounted, ref } from 'vue'
import GooseAccordion from '#components/GooseAccordion.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseTable from '#components/GooseTable.vue'
import GooseTabs from '#components/GooseTabs.vue'
import type { GooseTreeLeaf } from '#components/GooseTree.vue'
import GooseTreeRoot from '#components/GooseTreeRoot.vue'
import type { Ref } from 'vue'
import { RouterLink } from 'vue-router'
import TopBar from '#shared/TopBar.vue'
import axios from 'axios'
import { useLocalStorage } from '@vueuse/core'
import { useUserStore } from '#stores/useUserStore.ts'

/* Nothing is toggled by default */
useLocalStorage('sideBarToggled', '', {})

const accordionModel = ref({
  toggled: useLocalStorage('sideBarToggled', ''),
  items: [
    { id: 'orgs', title: 'Организации', icon: faBuilding },
    { id: 'forms', title: 'Формы', icon: faClipboard },
    { id: 'statuses', title: 'Статусы', icon: faPencil },
  ] })

const slots = [
  { id: 'xlsx', title: 'Исходники', icon: faFileExcel },
  { id: 'initial', title: 'Первичные отчёты', icon: faClipboard },
  { id: 'complex', title: 'Сводные отчёты', icon: faClipboardList },
]

const userStore = useUserStore()
const orgs: Ref<GooseTreeLeaf[]> = ref([])

/* TODO: Shared types */
interface ApiOrg {
  id: string
  name: string
  parent: string | null
}

onMounted(async () => {
  function toTree(arr: ApiOrg[], parent: string | null): GooseTreeLeaf[] | null {
    const filtered = arr.filter(i => i.parent === parent)
    return filtered.length
      ? filtered.map(i => (
          {
            title: `${i.id} - ${i.name}`,
            id: i.id,
            matched: true,
            checked: false,
            sub: toTree(arr, i.id) ?? undefined, /* TODO: Lunacy */
          }
        ))
      : null
  }

  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    res = await axiosInstance.get('/orgs'),
    apiOrgs: ApiOrg[] = res.data,
    leafs = toTree(apiOrgs, null)
  if (leafs !== null)
    orgs.value = leafs
})

</script>

<template>
  <div class="fs layout">
    <TopBar />
    <Splitpanes
      vertical
      @resized="async e => await userStore.setPayload({ sideBarWidth: e[0].size })"
    >
      <Pane
        max-size="50"
        :size="userStore.sideBarWidth"
      >
        <aside>
          <GooseAccordion v-model="accordionModel">
            <template #orgs>
              <GooseTreeRoot
                v-model="orgs"
                :searchable="true"
                :checkable="true"
              />
            </template>
          </GooseAccordion>
        </aside>
      </Pane>
      <Pane>
        <main>
          <GooseTabs :slots>
            <template #xlsx>
              <div style="padding: 1rem">
                <RouterLink to="/test">
                  Form
                </RouterLink>
                <GooseButton
                  :icon="faUpload"
                  transparent
                  tooltip="Загрузить .xlsx файл"
                />
              </div>
            </template>
            <template #initial>
              <p>Bar</p>
              <GooseTable style="width: 100%" />
            </template>
            <template #complex>
              <p>Baz</p>
            </template>
          </GooseTabs>
        </main>
      </Pane>
    </Splitpanes>
  </div>
</template>

<style lang="sass" scoped>
  .layout
    box-sizing: border-box
    display: flex
    flex-direction: column
    gap: .5rem
    padding: .5rem

  aside
    background-color: transparent
    height: 100%

  main
    height: 100%
    display: flex
    flex-direction: column

  .splitpanes
    box-sizing: border-box

  :deep(.splitpanes__splitter)
    min-width: 8px

  :deep(.splitpanes__pane)
    min-width: 16rem
</style>
