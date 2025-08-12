<script setup lang="ts">
import GooseButton from '#components/GooseButton.vue'
import GoosePagination from '#components/GoosePagination.vue'
import GoosePopupMenu from '#components/GoosePopupMenu.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
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

const showExtraDates = ref(false),
  extraDates = [
    { id: 'currentMonth', title: 'Текущий месяц' },
    { id: 'previousMonth', title: 'Предыдущий месяц' },
    { id: 'today', title: 'Сегодня' },
    { id: 'yesterday', title: 'Вчера' },
    { id: 'fromJan1', title: 'С начала года' },
  ],
  selectedExtraDate = ref('bar')

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
    sortBy.value,
    tableModel.value.desc,
  )
  pagination.value = { ...apiReports }
  tableModel.value.rows = apiReports.rows.map(r => ({ selected: false, data: r }))
  tableModel.value.toggledItems = new Array(pageSize.value).fill(false)
  loading.value = false
}

await update()
loading.value = false
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
      <input
        v-model="fromDate"
        class="calendar"
        type="date"
        :max="toDate"
      >
      -
      <input
        v-model="toDate"
        class="calendar"
        type="date"
        :min="fromDate"
      >
      <GoosePopupMenu
        v-model="selectedExtraDate"
        :active="showExtraDates"
        :items="extraDates"
        @update="d => { showExtraDates=false; console.log(d)}"
      >
        <GooseButton
          :icon="faEllipsisVertical"
          tooltip="Выбрать дату"
          tooltip-side="right"
          small
          transparent
          @click="showExtraDates = !showExtraDates"
        />
      </GoosePopupMenu>
    </div>
    <span>
      Foo
    </span>
  </div>
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
</style>
