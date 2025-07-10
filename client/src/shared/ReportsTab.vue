<script setup lang="ts">
import GoosePagination from '#components/GoosePagination.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import useFetchReports from '#composables/useFetchReports.ts'
import { ref } from 'vue'

const pageSizes = [
  {id: 10, title: 10},
  {id: 25, title: 25},
  {id: 50, title: 50},
  {id: 100, title: 100}
]

const pagination = ref({
  size: 10,
  page: 0,
  total: 0
})

const tableModel = ref({
  headers: [
    { title: 'Дата', sortable: true, prop: 'date' },
    { title: 'Организация', prop: 'org' },
    { title: 'Статус', prop: 'status' },
    { title: 'Год', sortable: true, prop: 'year' },
  ],
  rows: [],
  sortBy: 'date',
  desc: false,
}),
  loading = ref(true)

async function update() {
  loading.value = true
  const apiReports = await useFetchReports(
    pagination.value.size,
    pagination.value.page,
    tableModel.value.sortBy,
    tableModel.value.desc
  )
  pagination.value = {...apiReports}
  tableModel.value.rows = apiReports.rows
  loading.value = false
}

await update()
loading.value = false
</script>

<template>
  <div class="filters">
    <span>
      Отображать по:
      <GooseSelect :items="pageSizes"/>
    </span>
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
    style="padding: 1rem"
    :firstPages="5"
    :middlePages="1"
    :lastPages="1"
    :disabled="loading"
    v-model="pagination"
    @update="update"
  />
</template>

<style lang="sass">
  .filters
    align-items: center
    display: flex
    height: 3rem
    justify-content: space-between
</style>
