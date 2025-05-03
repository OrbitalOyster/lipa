<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Ref } from 'vue'

const emit = defineEmits(['submit']),
  validated = ref(false)
</script>

<template>
  <form
    novalidate
    :class="{ validated }"
    @submit.prevent="validated = true; emit('submit')"
  >
    <slot />
  </form>
</template>
