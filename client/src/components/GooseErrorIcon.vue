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
    <div class="error-icon">
      <FontAwesomeIcon
        :icon="faTriangleExclamation"
        size="2xl"
      />
    </div>
    <template #popover>
      <p>
        {{ message }}
      </p>
    </template>
  </GoosePopover>
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
