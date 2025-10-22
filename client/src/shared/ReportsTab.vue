<script setup lang="ts">
import { faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseLoading from '#components/GooseLoading.vue'
import GoosePagination from '#components/GoosePagination.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import { dateToPeriod } from '#composables/useDateTimeUtils.ts'
import { ref } from 'vue'
import useFetchReports from '#composables/useFetchReports.ts'
import { useLocalStorage } from '@vueuse/core'

const pageSizes = [
  { id: 10, title: '10' },
  { id: 25, title: '25' },
  { id: 50, title: '50' },
  { id: 100, title: '100' },
]

const currentMonth = dateToPeriod(new Date(), 'currentMonth'),
  fromDate = useLocalStorage('from-date', currentMonth.fromDate),
  toDate = useLocalStorage('to-date', currentMonth.toDate),
  sortBy = useLocalStorage('reports-sort-by', 'date'),
  desc = useLocalStorage('reports-sort-desc', false),
  size = useLocalStorage('reports-pagination-size', 10),
  page = useLocalStorage('reports-page', 0),
  tableModel = ref<TableModel<APIReport>>({
    headers: [
      { title: 'Дата', sortable: true, prop: 'date' },
      { title: 'Организация', prop: 'org' },
      { title: 'Статус', prop: 'status' },
      { title: 'Год', sortable: true, prop: 'year' },
    ],
    rows: [],
  }),
  loading = ref(true), /* On first load */
  updating = ref(false) /* On page change */

let total = 0

async function update() {
  updating.value = true
  const apiReports = await useFetchReports(
    size.value,
    page.value,
    fromDate.value,
    toDate.value,
    sortBy.value,
    desc.value,
  )
  size.value = apiReports.size
  page.value = apiReports.page
  total = apiReports.total
  tableModel.value.rows = apiReports.rows.map(r => ({ toggled: false, data: r }))
  updating.value = false
}

update()
  .then(() => loading.value = false)
  .catch((err) => { throw Error(`Error updating: ${err}`) })
</script>

<template>
  <div class="filters">
    <div class="page-size-select">
      <p>Отчётов найдёно: {{ total }}</p>
      <p>Отображать по:</p>
      <GooseSelect
        v-model="size"
        :items="pageSizes"
        @update="update"
      />
    </div>
    <div style="display: flex; align-items: center">
      <DateSelector
        v-model:from-date="fromDate"
        v-model:to-date="toDate"
        @update="update"
      />
    </div>
    <div style="display: flex; gap: .5rem">
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
        @click="async () => { loading = true; await update(); loading = false }"
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
      v-model:sort-by="sortBy"
      v-model:desc="desc"
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
        v-model="page"
        :size
        :total
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
