<script setup lang="ts">
import DateSelector from '#shared/DateSelector.vue'
import GoosePagination from '#components/GoosePagination.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import { ref } from 'vue'
import useFetchReports from '#composables/useFetchReports.ts'
import { useLocalStorage } from '@vueuse/core'

const pageSizes = [
    { id: 10, title: '10' },
    { id: 25, title: '25' },
    { id: 50, title: '50' },
    { id: 100, title: '100' },
  ],
  /* Syncs with local storage */
  pageSize = useLocalStorage('reports-pagination-size', pageSizes[0]!.id),
  page = useLocalStorage('reports-pagination-page', 0),
  sortBy = useLocalStorage('reports-sort-by', 'date'),
  sortDesc = useLocalStorage('reports-sort-desc', false),
  fromDate = useLocalStorage('reports-from-date', '2025-01-01'),
  toDate = useLocalStorage('reports-to-date', '2025-01-31')

const pagination = ref({
  size: pageSize.value,
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
    toggledItems: new Array(pageSize.value).fill(false),
  }),
  loading = ref(true)

async function update() {
  loading.value = true
  page.value = pagination.value.page
  sortBy.value = tableModel.value.sortBy
  sortDesc.value = tableModel.value.desc
  const apiReports = await useFetchReports(
    pageSize.value,
    pagination.value.page,
    fromDate.value,
    toDate.value,
    sortBy.value,
    tableModel.value.desc,
  )
  pagination.value = { ...apiReports }
  tableModel.value.rows = apiReports.rows.map(r => ({ selected: false, data: r }))
  tableModel.value.toggledItems = new Array(pageSize.value).fill(false)
  loading.value = false
}

await update()
</script>

<template>
  <div class="filters">
    <div class="page-size-select">
      <p>Отображать по:</p>
      <GooseSelect
        v-model="pageSize"
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
    <span>
      Foo
    </span>
  </div>
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
