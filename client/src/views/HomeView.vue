<script setup lang="ts">
import { faBuilding, faClipboard, faClipboardList, faFileExcel, faPencil, faSpinner, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseAccordion from '#components/GooseAccordion.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseTable from '#components/GooseTable.vue'
import GooseTabs from '#components/GooseTabs.vue'
import OrgTree from '#shared/OrgTree.vue'
import { RouterLink } from 'vue-router'
import TopBar from '#shared/TopBar.vue'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const accordionModel = ref({
  opened: useLocalStorage('sideBar', ''),
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

const tableModel = {
  headers: ['Изменён', 'Организация', 'Срок отчёта', 'Год'],
  rows: [
    ['123', 'Foo Bar', '4.3.2.1', '2000'],
    ['124', 'Foo Bar', '4.3.2.1', '2000'],
    ['125', 'Foo Bar', '4.3.2.1', '2000'],
    ['126', 'Foo Bar', '4.3.2.1', '2000'],
    ['127', 'Foo Bar', '4.3.2.1', '2000'],
    ['128', 'Foo Bar', '4.3.2.1', '2000'],
  ],
}
</script>

<template>
  <div class="home-view-wrapper">
    <TopBar />
    <div style="display: flex; flex-direction: row; flex-grow: 1; gap: 1rem">
      <aside>
        <GooseAccordion v-model="accordionModel">
          <template #orgs>
            <Suspense>
              <OrgTree />
              <template #fallback>
                <div class="loading">
                  <FontAwesomeIcon
                    class="fa-pulse"
                    :icon="faSpinner"
                  />
                </div>
              </template>
            </Suspense>
          </template>
        </GooseAccordion>
      </aside>
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
            <GooseTable v-model="tableModel" />
          </template>
          <template #complex>
            <p>Baz</p>
          </template>
        </GooseTabs>
      </main>
    </div>
  </div>
</template>

<style lang="sass" scoped>
  .home-view-wrapper
    box-sizing: border-box
    display: flex
    flex-direction: column
    gap: 1rem
    height: 100vh
    padding: 1rem
    position: fixed
    width: 100vw

  aside
    flex-basis: 32rem
    flex-shrink: 0

  main
    height: 100%
    width: 100%

  .loading
    align-items: center
    display: flex
    font-size: 3rem
    height: 100%
    justify-content: center
</style>
