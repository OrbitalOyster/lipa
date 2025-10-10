<script setup lang="ts">
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseSelect from '#components/GooseSelect.vue'
import UploadXLSX from '#shared/UploadXLSX.vue'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useLocalSettings } from '#stores/useLocalSettings.ts'
import { useTemplateRef } from 'vue'

const localSettings = useLocalSettings(),
  uploadModalRef = useTemplateRef('uploadModal')
const update = () => {}

</script>

<template>
  <UploadXLSX ref="uploadModal" />
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
</style>
