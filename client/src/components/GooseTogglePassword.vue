<script setup lang="ts">
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import GooseButton from '#components/GooseButton.vue'

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <GooseButton
    transparent
    tooltip="Показать/скрыть пароль"
    :icon="model ? faEye : faEyeSlash"
    @click="model = !model"
  />
</template>
