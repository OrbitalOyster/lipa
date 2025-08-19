<script setup lang="ts">
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import GooseSelect from '#components/GooseSelect.vue'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useLocalSettings } from '#stores/useLocalSettings.ts'

const localSettings = useLocalSettings()

function update() {

}
</script>

<template>
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
