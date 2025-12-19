<script setup lang="ts">
import './assets/reset.css'
import { getCurrentInstance } from 'vue'

const app = getCurrentInstance().appContext.app

app.config.errorHandler = (err, vm, info) => {
  console.error('Error:', err)
  console.error('Vue component:', vm)
  console.error('Additional info:', info)
}

</script>

<template>
  <div id="tooltips" />
  <div id="modals" />
  <RouterView v-slot="{ Component }">
    <Component :is="Component" />
  </RouterView>
</template>

<style lang="sass">
  @use 'assets/colors'

  body
    background-color: #F6F2F0
    color: colors.$text

  body, button, input
    font: 400 1rem 'Golos Text Variable'
</style>
