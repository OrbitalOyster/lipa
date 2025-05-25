<script setup lang="ts">
import './assets/style.sass'
import { getCurrentInstance } from 'vue'

const app = getCurrentInstance().appContext.app

app.config.errorHandler = (err, vm, info) => {
  console.error('Error:', err)
  console.error('Vue component:', vm)
  console.error('Additional info:', info)
}

</script>

<template>
  <div id="modals" />
  <RouterView />
</template>

<style lang="sass">
  @use 'assets/colors'

  body
    background-color: #F6F2F0
    color: colors.$text
    font-family: 'Exo 2 Variable'
</style>
