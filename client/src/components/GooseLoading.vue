<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <div>
    <FontAwesomeIcon
      class="fa-pulse"
      :icon="faSpinner"
    />
  </div>
</template>

<style lang="sass" scoped>
   div
      align-items: center
      display: flex
      font-size: 3rem
      height: 100%
      justify-content: center
      width: 100%
</style>
