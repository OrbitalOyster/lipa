<script setup lang="ts">
import DateSelector from '#shared/DateSelector.vue'
import GooseButton from '#components/GooseButton.vue'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useLocalSettings } from '#stores/useLocalSettings'

const localSettings = useLocalSettings()

function update() {
  
}
</script>

<template>
  <div>
    <div class="filters">
      <!--
      <div class="page-size-select">
        <p>Отображать по:</p>
        <GooseSelect
          v-model="localSettings.pageSize"
          :items="pageSizes"
          @update="update"
        />
      </div>
      -->
      <div style="display: flex; align-items: center">
        <DateSelector
          v-model:from-date="localSettings.fromDate"
          v-model:to-date="localSettings.toDate"
          @update="update"
        />
      </div>
      <div>
        <GooseButton :icon="faUpload" small tooltip="Загрузить .xlsx"/>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
</style>
