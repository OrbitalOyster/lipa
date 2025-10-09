<script setup lang="ts">
import { faPlus, faFileExcel, faUpload } from '@fortawesome/free-solid-svg-icons'
import { ref, useTemplateRef } from 'vue'
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseLoading from '#components/GooseLoading.vue'
import GooseModal from '#components/GooseModal.vue'
import GooseSelect from '#components/GooseSelect.vue'
import axios from 'axios'
import { useFileDialog } from '@vueuse/core'
import { useLocalSettings } from '#stores/useLocalSettings.ts'

const localSettings = useLocalSettings()

const { open, reset, onChange } = useFileDialog({
  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  multiple: false,
})

interface XLSXParseWorksheet {
  name: string
  tables: []
}

interface XLSXParseSuccess {
  worksheets: XLSXParseWorksheet[]
  key: string
}

const apiEndpoint = import.meta.env.VITE_API_URI,
  uploading = ref(false),
  xlsx = ref<null | File>(null),
  xlsxParseResult = ref<XLSXParseSuccess | null>(null)

if (!apiEndpoint)
  throw new Error('Missing api endpoint')

onChange((files) => {
  if (!files)
    return

  if (!files[0])
    throw new Error('Major screw-up')

  xlsx.value = null
  uploading.value = true

  const formData = new FormData()
  formData.append('attachment', files[0])

  axios.post(
    `${apiEndpoint}/upload`,
    formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log('File uploaded successfully:', response.data)
      xlsx.value = files[0]!
      xlsxParseResult.value = response.data
    })
    .catch((error) => {
      console.error('Error uploading file:', error)
    })
    .finally(() => uploading.value = false)
})

const update = () => {}

const uploadModalRef = useTemplateRef('uploadModal')
</script>

<template>
  <GooseModal
    ref="uploadModal"
    title="Новый шаблон"
    close-button
    @close="reset(); xlsx = null"
  >
    <div class="upload-modal">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <p>Выберите .xlsx файл современного формата</p>
        <GooseButton
          title="Выбрать .xlsx"
          :icon="faFileExcel"
          @click="open"
        />
      </div>
      <div>
        <GooseLoading v-if="uploading" />
        <div v-if="xlsx">
          <p> Название файла: {{ xlsx.name }} </p>
          <p> Размер: {{ Math.round((xlsx.size / 1024) * 100) / 100 }} kB </p>
          <p> Листов: {{ xlsxParseResult?.worksheets.length }} </p>
          <ul
            v-for="worksheet in xlsxParseResult?.worksheets"
            :key="worksheet.name"
          >
            <li>Лист {{ worksheet.name }}:</li>
            <ul
              v-for="table, i in worksheet.tables"
              :key="i"
              style="padding-left: 1rem"
            >
              <li>
                <div class="table-name"> {{ table.name }} </div> : {{ table.range }}
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  </GooseModal>
  <div>
    <div class="filters">
      <div class="page-size-select">
        <p>Отображать по:</p>
        <GooseSelect
          v-model="localSettings.pageSize"
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
</template>

<style lang="sass" scoped>
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

  .upload-modal
    width: 42rem

  .table-name
    display: inline-flex
    font-weight: bold
</style>
