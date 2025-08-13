<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseTooltip from '#components/GooseTooltip.vue'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

defineProps<{
  message?: string
}>()
</script>

<template>
  <!-- Validation error icon -->
  <GooseTooltip
    :text="message"
  >
    <div class="error-icon">
      <FontAwesomeIcon
        :icon="faTriangleExclamation"
        size="2xl"
      />
    </div>
  </GooseTooltip>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'

  .error-icon
    color: colors.$danger
    cursor: help
    width: 2.5rem

  p
    padding: .5rem
    margin: .5rem
    white-space: nowrap
</style>
