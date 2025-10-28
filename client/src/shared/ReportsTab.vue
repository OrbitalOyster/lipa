<script setup lang="ts">
import { faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'
import { onMounted, ref } from 'vue'
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GoosePagination from '#components/GoosePagination.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import axios from 'axios'
import { dateToPeriod } from '#composables/useDateTimeUtils.ts'
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
  updating = ref(false) /* On page change */

let total = 0

interface FetchReportsParams {
  size: number
  page: number
  fromDate: string
  toDate: string
  sortBy?: string
  desc?: boolean
}

async function update() {
  updating.value = true
  const params: FetchReportsParams = {
    size: size.value,
    page: page.value,
    fromDate: fromDate.value,
    toDate: toDate.value,
  }
  /* sortBy=date and desc=false are defaults */
  if (sortBy.value !== 'date')
    params.sortBy = sortBy.value
  if (desc.value)
    params.desc = true
  const axiosRes = await axios.get('/reports', { params }),
    apiReports: FetchReportsResult = axiosRes.data
  size.value = apiReports.size
  page.value = apiReports.page
  total = apiReports.total
  tableModel.value.rows = apiReports.rows.map(r => ({ toggled: false, data: r }))
  updating.value = false
}

onMounted(async () => await update())
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
      />
      <GooseButton
        :icon="faRotate"
        :loading="updating"
        tooltip="Обновить список"
        @click="async () => { await update() }"
      />
    </div>
  </div>
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
    <!-- On nothing found -->
    <template #empty>
      Отчётов не найдено
    </template>
  </GooseTable>
  <div
    v-if="tableModel.rows.length"
    class="pagination"
  >
    <GoosePagination
      v-model="page"
      :size
      :total
      :first-pages="5"
      :middle-pages="1"
      :last-pages="1"
      :disabled="updating"
      @update="update"
    />
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

  .pagination
    align-items: center
    display: flex
    height: 3rem
    justify-content: center
    padding: 1rem
</style>
