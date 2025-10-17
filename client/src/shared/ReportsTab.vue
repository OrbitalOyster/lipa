<script setup lang="ts">
import { faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseLoading from '#components/GooseLoading.vue'
import GoosePagination from '#components/GoosePagination.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import { ref } from 'vue'
import useFetchReports from '#composables/useFetchReports.ts'
import { useLocalSettings } from '#stores/useLocalSettings.ts'

const localSettings = useLocalSettings(),
  pagination = ref({
    size: localSettings.reportsPageSize,
    page: localSettings.reportsPage,
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
    sortBy: localSettings.reportsSortBy,
    desc: localSettings.reportsSortDesc,
    toggledItems: new Array(localSettings.reportsPageSize).fill(false),
  }),
  loading = ref(true), /* On first load */
  updating = ref(false) /* On page change */

/* Request data */
async function getData() {
  const apiReports = await useFetchReports(
    localSettings.reportsPageSize,
    pagination.value.page,
    localSettings.fromDate,
    localSettings.toDate,
    localSettings.reportsSortBy,
    tableModel.value.desc,
  )
  pagination.value = { ...apiReports }
  tableModel.value.rows = apiReports.rows.map(r => ({ selected: false, data: r }))
  tableModel.value.toggledItems = new Array(localSettings.reportsPageSize).fill(false)
}

async function update() {
  updating.value = true
  /* Set local settings */
  localSettings.reportsPage = pagination.value.page
  localSettings.reportsSortBy = tableModel.value.sortBy
  localSettings.reportsSortDesc = tableModel.value.desc
  await getData()
  updating.value = false
}

update()
  .then(() => loading.value = false)
  .catch((err) => { throw Error(`Error updating: ${err}`) })
</script>

<template>
  <div class="filters">
    <div class="page-size-select">
      <p>Отчётов найдёно: {{ pagination.total }}</p>
      <p>Отображать по:</p>
      <GooseSelect
        v-model="localSettings.reportsPageSize"
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
        tooltip="Создать первичный отчёт"
        tooltip-side="top"
      />
      <GooseButton
        :icon="faRotate"
        tooltip="Обновить список"
        tooltip-side="top"
        :loading
        @click="async () => { loading = true; await getData(); loading = false }"
      />
    </div>
  </div>
  <!-- On loading -->
  <div v-if="loading">
    <GooseLoading />
  </div>
  <div v-else-if="tableModel.rows.length">
    <GooseTable
      v-model="tableModel"
      :updating
      @update="update"
    >
      <template #date="{td}">
        {{ new Date(td).toLocaleString('ru') }}
      </template>

      <template #org="{td}">
        Formatted: {{ td }} !
      </template>
    </GooseTable>
    <div class="pagination">
      <GoosePagination
        v-model="pagination"
        :first-pages="5"
        :middle-pages="1"
        :last-pages="1"
        :disabled="loading || updating"
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

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  .filters
    align-items: center
    display: flex
    justify-content: space-between
    padding: .5rem

  .page-size-select
    align-items: center
    display: flex
    gap: 1rem
    justify-content: space-between

  .nothing-found
    display: flex
    justify-content: center
    padding: 2rem

  .pagination
    height: 3rem
    display: flex
    justify-content: center
    align-items: center
    padding: 1rem
</style>
