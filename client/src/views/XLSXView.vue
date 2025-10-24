<script setup lang="ts">
const props = defineProps<{
  hash: string
}>()
console.log(props.hash)
</script>

<template>
  <div>
    Hello, xlsx
  </div>
</template>

<style lang="sass" scoped>
</style>
