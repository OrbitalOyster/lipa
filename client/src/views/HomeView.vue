<script setup lang="ts">
import { faBars, faBuilding, faClipboard, faClipboardList, faFileExcel, faPencil, faUpload } from '@fortawesome/free-solid-svg-icons'
import GooseAccordion from '#components/GooseAccordion.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseLoading from '#components/GooseLoading.vue'
import GooseSidebar from '#components/GooseSidebar.vue'
import GooseTabs from '#components/GooseTabs.vue'
import OrgTree from '#shared/OrgTree.vue'
import ReportsTab from '#shared/ReportsTab.vue'
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

const sidebarToggled = ref(true)
</script>

<template>
  <div class="home-view-wrapper">
    <GooseSidebar
      :toggled="sidebarToggled"
      width="36rem"
    >
      <template #sidebar>
        <div class="accordion-wrapper">

    <div class="logo">
      <img src="/goose.webp">
      <h1>
        <RouterLink
          to="/"
          class="main-title"
        >
          Gooseberry.js
        </RouterLink>
      </h1>
    </div>

          <GooseAccordion v-model="accordionModel">
            <template #orgs>
              <Suspense>
                <OrgTree />
                <template #fallback>
                  <GooseLoading />
                </template>
              </Suspense>
            </template>
          </GooseAccordion>
        </div>
      </template>
      <div style="display: flex; gap: 0rem; align-items: center; padding-left: 1rem">
        <GooseButton
          transparent
          :icon="faBars"
          @click="sidebarToggled = !sidebarToggled"
        />
        <TopBar />
      </div>
      <!--
    <aside>
    </aside>
    -->
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
            <Suspense>
              <ReportsTab />
              <template #fallback>
                <GooseLoading />
              </template>
            </Suspense>
          </template>
          <template #complex>
            <p>Baz</p>
          </template>
        </GooseTabs>
      </main>
    </GooseSidebar>
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
    /* height: 100vh */
    /* padding: 1rem */
    /* position: fixed */
    /* width: 100vw */

  .logo
    display: flex
    align-items: center
    gap: 1rem

  .main-title
    color: inherit
    font-size: 2rem

  img
    border-radius: 100%
    height: 4rem
    width: 4rem

  h1
    display: inline
    font-weight: 400


  .accordion-wrapper
    box-sizing: border-box
    display: flex
    flex-direction: column
    gap: 1rem
    height: 100%
    padding: 1rem 1rem 1rem 1rem

    background-color: #f6f2f066
    border-radius: borders.$radius
    border: borders.$card
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)

  main
    padding: 1rem
</style>
