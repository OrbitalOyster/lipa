<script setup lang="ts">
import { faTriangleExclamation, faFileExcel, faUpload } from '@fortawesome/free-solid-svg-icons'
import { ref, useTemplateRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import GooseInput from '#components/GooseInput.vue'
import GooseLoading from '#components/GooseLoading.vue'
import GooseModal from '#components/GooseModal.vue'
import axios from 'axios'
import { useFileDialog } from '@vueuse/core'

interface XLSXParseSuccess {
  worksheets: {
    name: string
    tables: {
      name: string
      range: string
    }[]
  }[]
  key: string
}

const apiEndpoint = import.meta.env.VITE_API_URI,
  modal = useTemplateRef('modal'),
  uploading = ref(false),
  xlsxFile = ref<null | File>(null),
  parseResult = ref<XLSXParseSuccess | null>(null),
  error = ref(''),
  key = ref(''),
  saveAsFilename = ref('')

if (!apiEndpoint)
  throw new Error('Missing api endpoint')

const { open, reset, onChange } = useFileDialog({
  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  multiple: false,
})

const resetUploadForm = () => {
  error.value = ''
  uploading.value = false
  xlsxFile.value = null
  parseResult.value = null
  reset()
}

/* File selected */
onChange((files) => {
  if (!files || !files[0])
    return

  resetUploadForm()
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
      /* Parsing error */
      if ('err' in response.data) {
        error.value = response.data.err
      }
      else {
        xlsxFile.value = files[0]!
        parseResult.value = response.data
        saveAsFilename.value = xlsxFile.value.name
        key.value = parseResult.value.key
      }
    })
    .catch((error) => {
      console.error('Error uploading file:', error)
    })
    .finally(() => uploading.value = false)
})

const upload = async () => {
  console.log({ key, saveAsFilename })
  const result = await axios.post(
    `${apiEndpoint}/save`, {
      key: key.value,
      filename: saveAsFilename.value
    }
  )
  console.log(result)
}

defineExpose({ show: () => modal.value?.show() })
</script>

<template>
  <GooseModal
    ref="modal"
    title="Новый шаблон"
    close-button
    @close="resetUploadForm()"
  >
    <div class="upload-modal">
      <!-- Select file section -->
      <div style="display: flex; align-items: center; justify-content: space-between">
        <p>Выберите .xlsx файл современного формата</p>
        <GooseButton
          title="Выбрать .xlsx"
          :icon="faFileExcel"
          @click="open"
        />
      </div>
      <!-- Parse results section -->
      <div>
        <GooseLoading v-if="uploading" />
        <!-- On error -->
        <div
          v-if="!uploading && error"
          class="error-message"
        >
          <FontAwesomeIcon
            :icon="faTriangleExclamation"
            size="3x"
          />
          Не удалось распознать файл: {{ error }}
        </div>
        <!-- File stats section -->
        <div v-if="xlsxFile">
          <p> Название файла: {{ xlsxFile.name }} </p>
          <p> Размер: {{ Math.round((xlsxFile.size / 1024) * 100) / 100 }} kB </p>
          <p> Листов: {{ parseResult?.worksheets.length }} </p>
          <ul
            v-for="worksheet in parseResult?.worksheets"
            :key="worksheet.name"
          >
            <li>Лист {{ worksheet.name }}:</li>
            <ul
              v-for="table, i in worksheet.tables"
              :key="i"
              style="padding-left: 1rem"
            >
              <li>
                <div class="table-name">
                  {{ table.name }}
                </div> : {{ table.range }}
              </li>
            </ul>
          </ul>
          <div style="display: flex; align-items: center; gap: 1rem">
            <p>Сохранить шаблон как:</p>
            <GooseInput
              v-model="saveAsFilename"
              style="flex-grow: 1"
            />
            <GooseButton
              title="Загрузить"
              :icon="faUpload"
              @click="upload"
            />
          </div>
        </div>
      </div>
    </div>
  </GooseModal>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'

  .upload-modal
    width: 42rem

  .error-message
    align-items: center
    color: colors.$danger
    display: flex
    gap: 1rem
    justify-content: center
    padding: 1rem

  .table-name
    display: inline-flex
    font-weight: bold
</style>
