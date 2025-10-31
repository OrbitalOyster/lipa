<script setup lang="ts">
import axios from 'axios'
import { onMounted } from 'vue'

const props = defineProps<{
  hash: string
}>()

onMounted(async () => {
  const xlsx = await axios.get(`/xlsx/${props.hash}`)
  console.log(xlsx.data)
})
</script>

<template>
  <div>
    Hello, xlsx
  </div>
</template>

<style lang="sass" scoped>
</style>
