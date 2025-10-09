<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <div>
    <FontAwesomeIcon
      class="fa-pulse"
      :icon="faSpinner"
      size="3x"
    />
  </div>
</template>

<style lang="sass" scoped>
  div
    align-items: center
    box-sizing: border-box
    display: flex
    height: 100%
    justify-content: center
    padding: 1rem
    width: 100%
</style>
