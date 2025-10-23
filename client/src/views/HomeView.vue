<script setup lang="ts">
import { faBuilding, faClipboard, faClipboardList, faFileExcel, faPencil, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseAccordion from '#components/GooseAccordion.vue'
import GooseLoading from '#components/GooseLoading.vue'
import GooseScrollToTop from '#components/GooseScrollToTop.vue'
import GooseSidebar from '#components/GooseSidebar.vue'
import GooseTabs from '#components/GooseTabs.vue'
import MainLogo from '#shared/MainLogo.vue'
import OrgTree from '#shared/OrgTree.vue'
import ReportsTab from '#shared/ReportsTab.vue'
import TopBar from '#shared/TopBar.vue'
import XLSXTab from '#shared/XLSXTab.vue'
import { useLocalStorage } from '@vueuse/core'

const accordionItems = [
    { id: 'orgs', title: 'Организации', icon: faBuilding },
    { id: 'forms', title: 'Формы', icon: faClipboard },
    { id: 'statuses', title: 'Статусы', icon: faPencil },
  ],
  slots = [
    { id: 'xlsx', title: 'Шаблоны', icon: faFileExcel },
    { id: 'initial', title: 'Первичные отчёты', icon: faClipboard },
    { id: 'complex', title: 'Сводные отчёты', icon: faClipboardList },
  ],
  sideBarToggled = useLocalStorage('sidebar-toggled', false),
  sideBar = useLocalStorage('sidebar', ''),
  tab = useLocalStorage('tab', 'initial')
</script>

<template>
  <div class="home-view-wrapper">
    <GooseSidebar
      :toggled="sideBarToggled"
      width="36rem"
    >
      <template #sidebar>
        <div class="accordion-wrapper">
          <MainLogo />
          <GooseAccordion
            v-model:opened="sideBar"
            :items="accordionItems"
          >
            <template #orgs>
              <Suspense>
                <OrgTree />
                <template #fallback>
                  <GooseLoading />
                </template>
              </Suspense>
            </template>
          </GooseAccordion>
          <p>
            По всем вопросам обращайтесь
            <FontAwesomeIcon
              :icon="faPhone"
            />
            8 (812) 246-47-49
          </p>
        </div>
      </template>
      <TopBar />
      <main>
        <GooseTabs
          v-model="tab"
          :slots
        >
          <template #xlsx>
            <XLSXTab />
          </template>
          <template #initial>
            <ReportsTab />
          </template>
          <template #complex>
            <p>Baz</p>
          </template>
        </GooseTabs>
      </main>
    </GooseSidebar>

    <GooseScrollToTop />
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'

  .home-view-wrapper
    box-sizing: border-box
    display: flex
    flex-direction: column
    gap: 1rem

  .accordion-wrapper
    background-color: #f6f2f066
    border-radius: borders.$radius
    border: borders.$card
    box-sizing: border-box
    display: flex
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)
    flex-direction: column
    gap: 1rem
    height: 100%
    padding: 1rem 1rem 1rem 1rem

  main
    padding: 1rem
</style>
