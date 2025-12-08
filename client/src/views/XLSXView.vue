<script setup lang="ts">
import XLSXWorkbook from '#components/xlsx/XLSXWorkbook.vue'

defineProps<{
  hash: string
}>()
</script>

<template>
  <Suspense>
    <XLSXWorkbook :hash />
  </Suspense>
  <div
    id="hidden"
  />
</template>
