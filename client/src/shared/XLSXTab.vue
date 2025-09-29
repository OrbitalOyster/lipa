<script setup lang="ts">
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseModal from '#components/GooseModal.vue'
import GooseSelect from '#components/GooseSelect.vue'
import axios from 'axios'
import { useFileDialog } from '@vueuse/core'
import { useLocalSettings } from '#stores/useLocalSettings.ts'
import { useTemplateRef } from 'vue'

const localSettings = useLocalSettings()

const { files, open, reset, onChange } = useFileDialog ({
  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  multiple: false,
})

const apiEndpoint = import.meta.env.VITE_API_URI

if (!apiEndpoint)
  throw new Error('Missing api endpoint')

onChange((files) => {
  if (files) {
    if (!files[0])
      throw new Error('Major screw-up')

    const formData = new FormData()
    formData.append('attachment', files[0])

    axios.post(`${apiEndpoint}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log('File uploaded successfully:', response.data)
      })
      .catch((error) => {
        console.error('Error uploading file:', error)
      })
  }
})

function update() {

}

const uploadModalRef = useTemplateRef('uploadModal')
</script>

<template>
  <GooseModal
    ref="uploadModal"
    title="Загрузить шаблон"
    @close="reset"
  >
    <div class="upload-modal">
      <GooseButton
        title="Выбрать .xlsx"
        :icon="faUpload"
        @click="open"
      />
      <div v-if="files?.length">
        <div style="display: flex; align-items: center; justify-content: space-between">
          <p> {{ files[0].name }} </p>
          <p> Размер: {{ Math.round((files[0].size / 1024) * 100) / 100 }} kB</p>
          <GooseButton
            transparent
            small
            :icon="faTrash"
          />
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
          :icon="faUpload"
          small
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
    width: 32rem
</style>
