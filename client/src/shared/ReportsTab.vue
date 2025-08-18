<script setup lang="ts">
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GoosePagination from '#components/GoosePagination.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'
import useFetchReports from '#composables/useFetchReports.ts'
import { useLocalSettings } from '#stores/useLocalSettings.ts'
import { useLocalStorage } from '@vueuse/core'

const localSettings = useLocalSettings(),
  page = useLocalStorage('reports-pagination-page', 0),
  sortBy = useLocalStorage('reports-sort-by', 'date'),
  sortDesc = useLocalStorage('reports-sort-desc', false)

const pagination = ref({
  size: localSettings.pageSize,
  page: page.value,
  total: 0,
})

const tableModel = ref<TableModel<APIReport>>({
    headers: [
      { title: 'Дата', sortable: true, prop: 'date' },
      { title: 'Организация', prop: 'org' },
      { title: 'Статус', prop: 'status' },
      { title: 'Год', sortable: true, prop: 'year' },
    ],
    rows: [],
    sortBy: sortBy.value,
    desc: sortDesc.value,
    toggledItems: new Array(localSettings.pageSize).fill(false),
  }),
  loading = ref(true)

async function update() {
  loading.value = true
  page.value = pagination.value.page
  sortBy.value = tableModel.value.sortBy
  sortDesc.value = tableModel.value.desc
  const apiReports = await useFetchReports(
    localSettings.pageSize,
    pagination.value.page,
    localSettings.fromDate,
    localSettings.toDate,
    sortBy.value,
    tableModel.value.desc,
  )
  pagination.value = { ...apiReports }
  tableModel.value.rows = apiReports.rows.map(r => ({ selected: false, data: r }))
  tableModel.value.toggledItems = new Array(localSettings.pageSize).fill(false)
  loading.value = false
}

update()
</script>

<template>
  <div class="filters">
    <div class="page-size-select">
      <p>Отображать по:</p>
      <GooseSelect
        v-model="localSettings.pageSize"
        :items="localSettings.pageSizes"
        @update="update"
      />
    </div>
    <div style="display: flex; align-items: center">
      <DateSelector
        v-model:from-date="localSettings.fromDate"
        v-model:to-date="localSettings.toDate"
        @update="update"
      />
    </div>
    <div>
      <GooseButton
        :icon="faPlus"
        small
        tooltip="Создать первичный отчёт"
      />
    </div>
  </div>
  <!-- On loading -->
  <!--
    <div v-if="loading" style="padding: 3rem">
      <GooseLoading />
    </div>
  -->
  <div v-if="tableModel.rows.length">
    <GooseTable
      v-model="tableModel"
      :loading
      @update="update"
    >
      <template #date="{td}">
        {{ new Date(td).toLocaleString('ru') }}
      </template>

      <template #org="{td}">
        Formatted: {{ td }} !
      </template>
    </GooseTable>
    <div style="height: 3rem; display: flex; justify-content: center; align-items: center; padding: 1rem">
      <GoosePagination
        v-model="pagination"
        style="padding: 1rem"
        :first-pages="5"
        :middle-pages="1"
        :last-pages="1"
        :disabled="loading"
        @update="update"
      />
    </div>
  </div>
  <div
    v-else
    class="nothing-found"
  >
    <p>Отчётов не найдено</p>
  </div>
</template>

<style lang="sass">
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  .filters
    align-items: center
    display: flex
    height: 3rem
    justify-content: space-between
    padding: .5rem

  .page-size-select
    align-items: center
    display: flex
    gap: 1rem
    justify-content: space-between
    width: 15rem

  .calendar
    background-color: colors.$input-background
    border-radius: borders.$radius
    border: 1px solid colors.$input-border
    box-sizing: border-box
    color: colors.$text
    font: inherit
    height: 2.5rem
    min-width: 10rem
    outline: colors.$outline solid 0px
    padding: .25rem .5rem .25rem .75rem
    transition: transitions.$focusable, transitions.$colors

  .calendar:focus
    border-color: colors.$outline
    outline-width: borders.$focus-outline-width

  .nothing-found
    display: flex
    justify-content: center
    padding: 2rem
</style>
