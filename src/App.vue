<script setup lang="ts">
// Import { ref } from 'vue'
// Const n = ref(0)
// Const foo = import.meta.env.VITE_SOME_FOO
</script>

<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style scoped>
  h1 {
    color: darkslategray;
  }
</style>
