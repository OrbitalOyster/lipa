<script setup lang="ts">
import { faBars, faBuilding, faClipboard, faClipboardList, faFileExcel, faPencil, faPhone, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseAccordion from '#components/GooseAccordion.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseLoading from '#components/GooseLoading.vue'
import GooseSidebar from '#components/GooseSidebar.vue'
import GooseTabs from '#components/GooseTabs.vue'
import MainLogo from '#shared/MainLogo.vue'
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
          <MainLogo />
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
          <p>
            По всем вопросам обращайтесь
            <FontAwesomeIcon
              style="width: 2rem"
              :icon="faPhone"
              size="lg"
            />
            8 (812) 246-47-49
          </p>
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
