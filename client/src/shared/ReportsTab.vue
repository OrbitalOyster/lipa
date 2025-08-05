<script setup lang="ts">
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
  sortDesc = useLocalStorage('reports-sort-desc', false)

const pagination = ref({
  size: pageSize.value,
  page: page.value,
  total: 0,
})

const tableModel = ref<TableModel>({
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
    <span>
      От. До.
    </span>
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
  <GoosePagination
    v-model="pagination"
    style="padding: 1rem"
    :first-pages="5"
    :middle-pages="1"
    :last-pages="1"
    :disabled="loading"
    @update="update"
  />
</template>

<style lang="sass">
  .filters
    align-items: center
    display: flex
    height: 3rem
    justify-content: space-between

  .page-size-select
    align-items: center
    display: flex
    gap: 1rem
    justify-content: space-between
    width: 15rem
</style>
