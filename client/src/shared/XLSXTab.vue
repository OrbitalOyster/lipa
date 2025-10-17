<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseLoading from '#components/GooseLoading.vue'
import GoosePagination from '#components/GoosePagination.vue'
import GooseSelect from '#components/GooseSelect.vue'
import GooseTable from '#components/GooseTable.vue'
import UploadXLSX from '#shared/UploadXLSX.vue'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFetchTemplates } from '#composables/useFetchData.ts'
import { useLocalSettings } from '#stores/useLocalSettings.ts'

interface XLSXTemplate
{
  date: string
  userId: string
  filename: string
}

const localSettings = useLocalSettings(),
  pagination = ref({
    size: localSettings.templatesPageSize,
    page: localSettings.templatesPage,
    total: 0,
  }),
  uploadModalRef = useTemplateRef('uploadModal'),
  tableModel = ref<TableModel<XLSXTemplate>>({
    headers: [
      { title: 'Дата', sortable: true, prop: 'date' },
      { title: 'Пользователь', prop: 'userId' },
      { title: 'Имя файла', prop: 'filename' },
    ],
    rows: [],
    sortBy: localSettings.templatesSortBy,
    desc: localSettings.templatesSortDesc,
    toggledItems: new Array(localSettings.templatesPageSize).fill(false),
  }),
  loading = ref(true), /* On first load */
  updating = ref(false) /* On page change */

/* Request data */
async function getData() {
  const apiTemplates = await useFetchTemplates(
    localSettings.templatesPageSize,
    pagination.value.page,
    localSettings.fromDate,
    localSettings.toDate,
    localSettings.templatesSortBy,
    tableModel.value.desc,
  )
  console.log(apiTemplates)
  pagination.value = { ...apiTemplates }
  tableModel.value.rows = apiTemplates.rows.map(r => ({ selected: false, data: r }))
  tableModel.value.toggledItems = new Array(localSettings.templatesPageSize).fill(false)
}

async function update() {
  updating.value = true
  /* Set local settings */
  localSettings.templatesPage = pagination.value.page
  localSettings.templatesSortBy = tableModel.value.sortBy
  localSettings.templatesSortDesc = tableModel.value.desc
  await getData()
  updating.value = false
}

update()
  .then(() => loading.value = false)
  .catch((err) => { throw Error(`Error updating: ${err}`) })
</script>

<template>
  <UploadXLSX ref="uploadModal" />
  <div>
    <div class="filters">
      <div class="page-size-select">
        <p>Отображать по:</p>
        <GooseSelect
          v-model="localSettings.templatesPageSize"
          :items="localSettings.pageSizes"
          @update="update"
        />
      </div>
      <div style="display: flex; align-items: center">
        <DateSelector
          v-model:from-date="localSettings.fromDate"
          v-model:to-date="localSettings.toDate"
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
      :updating
      @update="update"
    >
      <template #date="{td}">
        {{ new Date(td).toLocaleString('ru') }}
      </template>

      <template #org="{td}">
        Formatted: {{ td }} !
      </template>
    </GooseTable>
    <div class="pagination">
      <GoosePagination
        v-model="pagination"
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
    <p>Отчётов не найдено</p>
  </div>
</template>

<style lang="sass" scoped>
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
    width: 15rem
</style>
