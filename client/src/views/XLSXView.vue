<script setup lang="ts">
import { onMounted, ref } from 'vue'
import XLSXWorksheet from '#components/xlsx/XLSXWorksheet.vue'
import axios from 'axios'

const props = defineProps<{
  hash: string
}>()

const xlsx = ref(null)

onMounted(async () => {
  const axiosRes = await axios.get(`/xlsx/${props.hash}`)
  xlsx.value = axiosRes.data.serialized[0]
})
</script>

<template>
  <div>
    <XLSXWorksheet v-model="xlsx" />
  </div>
</template>

<style lang="sass" scoped>
</style>
