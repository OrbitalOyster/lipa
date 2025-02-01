<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'
import { Pane, Splitpanes } from 'splitpanes'
import { faBuilding, faClipboard, faClipboardList, faFileExcel, faPencil, faUpload } from '@fortawesome/free-solid-svg-icons'
import GooseAccordion from '#components/GooseAccordion.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseTable from '#components/GooseTable.vue'
import GooseTabs from '#components/GooseTabs.vue'
import { RouterLink } from 'vue-router'
import TopBar from '#shared/TopBar.vue'
import { ref } from 'vue'

const accordionModel = ref([
  { id: 'orgs', title: 'Организации', icon: faBuilding },
  { id: 'forms', title: 'Формы', icon: faClipboard },
  { id: 'statuses', title: 'Статусы', icon: faPencil },
])

const slots = [
  { id: 'xlsx', title: 'Исходники', icon: faFileExcel },
  { id: 'initial', title: 'Первичные отчёты', icon: faClipboard },
  { id: 'complex', title: 'Сводные отчёты', icon: faClipboardList },
]
</script>

<template>
  <div class="fs layout">
    <TopBar />
    <Splitpanes vertical>
      <Pane
        max-size="50"
        size="25"
      >
        <aside>
          <GooseAccordion v-model="accordionModel">
            <template #Организации>
              <p>LoremIpsum</p>
            </template>
            <template #Формы>
              <p>Bar</p>
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
