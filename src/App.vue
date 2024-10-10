<script setup lang="ts">
// import { ref } from 'vue'
// const n = ref(0)
// const foo = import.meta.env.VITE_SOME_FOO
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
