<script setup lang="ts">
import { ref } from 'vue'
import GooseInput from '#components/GooseInput.vue'
import XLSXWorksheet from '#components/xlsx/XLSXWorksheet.vue'
import axios from 'axios'

const props = defineProps<{
  hash: string
}>()

const axiosRes = await axios.get(`/xlsx/${props.hash}`),
  xlsx = ref(axiosRes.data.serialized),
  activeSheet = ref('0')
</script>

<template>
  <div>
    <XLSXWorksheet v-model="xlsx[Number(activeSheet)]" />
    <div style="display: flex; margin-top: 1rem">
      <GooseInput v-model="activeSheet" />
    </div>
  </div>
</template>
