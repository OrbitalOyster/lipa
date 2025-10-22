<script setup lang="ts">
import { faFile, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { ref, useTemplateRef } from 'vue'
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseConfirm from '#components/GooseConfirm.vue'
import GooseLoading from '#components/GooseLoading.vue'
import GoosePagination from '#components/GoosePagination.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import UploadXLSX from '#shared/UploadXLSX.vue'
import { dateToPeriod } from '#composables/useDateTimeUtils.ts'
import { useFetchTemplates } from '#composables/useFetchData.ts'
import { useLocalStorage } from '@vueuse/core'

interface XLSXTemplate
{
  date: string
  userId: string
  filename: string
}

const pageSizes = [
  { id: 10, title: '10' },
  { id: 25, title: '25' },
  { id: 50, title: '50' },
  { id: 100, title: '100' },
]

const currentMonth = dateToPeriod(new Date(), 'currentMonth'),
  fromDate = useLocalStorage('from-date', currentMonth.fromDate),
  toDate = useLocalStorage('to-date', currentMonth.toDate),
  sortBy = useLocalStorage('templates-sort-by', 'date'),
  desc = useLocalStorage('templates-sort-desc', false),
  size = useLocalStorage('templates-pagination-size', 10),
  page = useLocalStorage('templates-page', 0),

  uploadModalRef = useTemplateRef('uploadModal'),
  confirmDeleteRef = useTemplateRef('confirmDelete'),
  tableModel = ref<TableModel<XLSXTemplate>>({
    headers: [
      { title: 'Дата', sortable: true, prop: 'date' },
      { title: 'Пользователь', prop: 'userId' },
      { title: 'Имя файла', sortable: true, prop: 'filename' },
      { title: 'Операции', prop: 'actions' },
    ],
    rows: [],
  }),
  loading = ref(true), /* On first load */
  updating = ref(false) /* On page change */

let total = 0

const deleteTemplateConfirmed = (filename: string) => {
  console.log('Delete', filename)
}

const viewTemplate = (filename: string) => {
  console.log('View', filename)
}

async function update() {
  updating.value = true
  const apiTemplates = await useFetchTemplates(
    size.value,
    page.value,
    fromDate.value,
    toDate.value,
    sortBy.value,
    desc.value,
  )
  size.value = apiTemplates.size
  page.value = apiTemplates.page
  total = apiTemplates.total
  tableModel.value.rows = apiTemplates.rows.map(r => ({ toggled: false, data: r }))
  updating.value = false
}

update()
  .then(() => loading.value = false)
  .catch((err) => { throw Error(`Error updating: ${err}`) })
</script>

<template>
  <GooseConfirm
    ref="confirmDelete"
    title="Удалить шаблон?"
    @submit="deleteTemplateConfirmed"
  />
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
      <template #actions="{row}">
        <GooseButton
          :icon="faFile"
          transparent
          color="primary"
          @click="viewTemplate(row.filename)"
        />
        <GooseButton
          :icon="faTrash"
          transparent
          color="danger"
          @click="confirmDeleteRef?.show(`Удалить шаблон &quot;${row.filename}?&quot;`)"
        />
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
    <p>Шаблонов не найдено</p>
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
