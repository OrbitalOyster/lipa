<script setup lang="ts">
import { faFile, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { onMounted, ref, useTemplateRef } from 'vue'
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseConfirm from '#components/GooseConfirm.vue'
import GoosePagination from '#components/GoosePagination.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import UploadXLSX from '#shared/UploadXLSX.vue'
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
  sortBy = useLocalStorage('xlsx-sort-by', 'date'),
  desc = useLocalStorage('xlsx-sort-desc', false),
  size = useLocalStorage('xlsx-pagination-size', 10),
  page = useLocalStorage('xlsx-page', 0),
  uploadModalRef = useTemplateRef('uploadModal'),
  confirmDeleteRef = useTemplateRef('confirmDelete'),
  tableModel = ref<TableModel<APITemplate>>({
    headers: [
      { title: 'Загружен', sortable: true, prop: 'date' },
      { title: 'Пользователь', prop: 'userId' },
      { title: 'Имя файла', sortable: true, prop: 'filename' },
      { title: 'Hash', prop: 'hash' },
      { title: 'Операции', prop: 'actions' },
    ],
    rows: [],
  }),
  updating = ref(false) /* On page change */

let total = 0

const deleteTemplate = (hash: string) => {
  console.log('Delete', hash)
}

async function update() {
  updating.value = true
  const params = {
    size: size.value,
    page: page.value,
    fromDate: fromDate.value,
    toDate: toDate.value,
    sortBy: sortBy.value,
    desc: desc.value,
  }
  const apiTemplates: FetchXLSXResult = await axios.get('/xlsx', { params })
    .then(res => res.data)
  size.value = apiTemplates.size
  page.value = apiTemplates.page
  total = apiTemplates.total
  tableModel.value.rows = apiTemplates.rows.map(r => ({ toggled: false, data: r }))
  updating.value = false
}

onMounted(async () => await update())
</script>

<template>
  <GooseConfirm ref="confirmDelete" />
  <UploadXLSX ref="uploadModal" />
  <div>
    <div class="filters">
      <div class="page-size-select">
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
      <div>
        <GooseButton
          :icon="faPlus"
          tooltip="Загрузить .xlsx"
          @click="uploadModalRef?.show()"
        />
      </div>
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

    <template #hash="{td}">
      {{ td }}...
    </template>

    <template #actions="{row}">
      <RouterLink :to="`/xlsx/${row.hash}`">
        <GooseButton
          :icon="faFile"
          tooltip="Просмотреть шаблон"
          transparent
          color="primary"
        />
      </RouterLink>
      <GooseButton
        :icon="faTrash"
        transparent
        color="danger"
        @click="confirmDeleteRef?.show(
          `Удалить шаблон &quot;${row.filename}?&quot;`,
          () => deleteTemplate(row.hash)
        )"
      />
    </template>
    <!-- On nothing found -->
    <template #empty>
      Шаблонов не найдено
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
  .filters
    align-items: center
    display: flex
    justify-content: space-between
    padding: .5rem

  .nothing-found
    display: flex
    justify-content: center
    padding: 2rem

  .page-size-select
    align-items: center
    display: flex
    gap: 1rem
    justify-content: space-between
    width: 15rem

  .pagination
    height: 3rem
    display: flex
    justify-content: center
    align-items: center
    padding: 1rem
</style>
