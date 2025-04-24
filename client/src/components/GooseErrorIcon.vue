<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GoosePopover from '#components/GoosePopover.vue'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

defineProps<{
  message?: string
}>()
</script>

<template>
  <!-- Validation error icon -->
  <GoosePopover
    v-if="message"
    has-arrow
    hover-toggle
  >
    <div class="alert-icon">
      <FontAwesomeIcon
        :icon="faTriangleExclamation"
        size="2xl"
      />
    </div>
    <template #popover>
      <p class="validation-message">
        {{ message }}
      </p>
    </template>
  </GoosePopover>
</template>

<style scoped lang="sass">
  .validation-message
    padding: .5rem
    margin: .5rem
    white-space: nowrap
</style>
