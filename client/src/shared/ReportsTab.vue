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
    { title: 'Год', prop: 'year' },
  ],
  rows: [],
})

async function update() {
  const apiReports = await useFetchReports(pagination.value.size, pagination.value.page)
  pagination.value = {...apiReports}
  tableModel.value.rows = apiReports.rows.map(r => ({
    ...r,
    /* Convert JSON prop to actual Date */
    date: new Date(r.date).toLocaleString('ru'),
  }))
}

async function onPageChange() {
  await update()
}

update()
</script>

<template>
  <GoosePagination v-model="pagination" @update="onPageChange"/>
  <GooseTable v-model="tableModel">
    <template #n="{td}">
      Number: {{ td }}
    </template>

    <template #str="{td}">
      Formatted: {{ td }} !
    </template>
  </GooseTable>
</template>
