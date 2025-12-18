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
    font-family: 'Golos Text Variable'

  button
    font-family: 'Golos Text Variable'
    /* It's 0.833333333rem by default for some reason */
    font-size: 1rem

  #tooltips
    position: absolute
    z-index: 100
</style>
