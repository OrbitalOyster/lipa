<script setup lang="ts">
import { ref } from 'vue'
const n = ref(0)
const foo = import.meta.env.VITE_SOME_FOO
</script>

<template>
  <h1>Lipa</h1>
  <button @click="n++">
    Click me
  </button>
  <div>{{ n }}</div>
  <strong>{{ foo }}</strong>
</template>

<style scoped>
  h1 {
    color: darkslategray;
  }
</style>
