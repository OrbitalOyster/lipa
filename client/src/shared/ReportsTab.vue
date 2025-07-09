<script setup lang="ts">
import GooseTable from '#components/GooseTable.vue'
import GoosePagination from '#components/GoosePagination.vue'
import useFetchReports from '#composables/useFetchReports.ts'

import { ref } from 'vue'

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
  sortBy: 'year',
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
