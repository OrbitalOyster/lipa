<script setup lang="ts">
import GooseTable from '#components/GooseTable.vue'
import GoosePagination from '#components/GoosePagination.vue'
import useFetchReports from '#composables/useFetchReports.ts'

import { ref } from 'vue'

const pagination = ref({
  size: 25,
  page: 0,
  total: 500
})

const reports = await useFetchReports(pagination.value.size, pagination.value.page),
  parsedReports = reports.rows.map(r => ({
    ...r,
    date: new Date(r.date).toLocaleString('ru'),
  }))

const tableModel = ref({
  headers: [
    { title: 'Дата', sortable: true, prop: 'date' },
    { title: 'Организация', prop: 'org' },
    { title: 'Статус', prop: 'status' },
    { title: 'Год', prop: 'year' },
  ],
  rows: parsedReports,
})

async function onPageChange() {
  const reports = await useFetchReports(pagination.value.size, pagination.value.page),
    parsedReports = reports.rows.map(r => ({
      ...r,
      date: new Date(r.date).toLocaleString('ru'),
    }))

  tableModel.value.rows = parsedReports
}

</script>

<template>
  {{ pagination.page }}
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
