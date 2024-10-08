<script setup lang="ts">
import { ref } from 'vue'
const n = ref(0)
</script>

<template>
  <h1>Hello, World!</h1>
  <button @click="n++">
    Click me
  </button>
  <div>{{ n }}</div>
</template>

<style scoped>
  h1 {
    color: darkslategray;
  }
</style>
