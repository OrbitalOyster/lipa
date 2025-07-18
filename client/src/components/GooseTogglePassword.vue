<script setup lang="ts">
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import GooseButton from '#components/GooseButton.vue'

const toggled = defineModel<boolean>({ required: true })
</script>

<template>
  <GooseButton
    transparent
    tooltip="Показать/скрыть пароль"
    :icon="toggled ? faEye : faEyeSlash"
    @click="toggled = !toggled"
  />
</template>
