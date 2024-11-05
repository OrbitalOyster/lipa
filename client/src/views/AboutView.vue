<script setup lang="ts">
import ConfirmModal from '../components/ConfirmModal.vue'
import MyButton from '../components/MyButton.vue'
import { useTemplateRef } from 'vue'
// eslint-disable-next-line no-useless-assignment
const confirmModal = useTemplateRef('confirmModal')
</script>

<template>
  <ConfirmModal
    ref="confirmModal"
    title="Are you sure you want to log out?"
    @submit="console.log('modal ok')"
  />
  <main>
    <div>
      <h1> About page </h1>
      <MyButton
        title="Alert"
        @click="confirmModal?.show"
      />
      <img
        src="/icon.svg"
      >
      <RouterLink to="/">
        back
      </RouterLink>
    </div>
  </main>
</template>
