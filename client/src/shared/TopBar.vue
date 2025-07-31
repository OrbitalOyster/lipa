<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import GooseButton from '#components/GooseButton.vue'
import GooseConfirm from '#components/GooseConfirm.vue'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useTemplateRef } from 'vue'
import { useUserStore } from '#stores/useUserStore.ts'

const userStore = useUserStore(),
  router = useRouter(),
  logoutConfirm = useTemplateRef('logoutConfirm')

async function logout() {
  await userStore.logout()
  await router.push('/login')
}
</script>

<template>
  <GooseConfirm
    ref="logoutConfirm"
    title="Выйти из системы?"
    @submit="logout"
  />
  <header>
    <div class="logo">
      <img src="/goose.webp">
      <h1>
        <RouterLink
          to="/"
          class="main-title"
        >
          Gooseberry.js
        </RouterLink>
      </h1>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; gap: .5rem">
      <div style="font-size: 1.5rem">
        Главная
      </div>
      <div style="font-size: 1rem">
        Отчёты
      </div>
    </div>
    <div style="align-items: center; display: flex; gap: 1rem">
      <div>
        Вы зашли как:
        <span class="username">
          {{ userStore.userId }}
        </span>
      </div>
      <GooseButton
        :icon="faRightFromBracket"
        tooltip="Выйти из системы"
        tooltip-side="bottom"
        small
        warning
        @click="logoutConfirm?.show()"
      />
    </div>
  </header>
</template>

<style lang="sass" scoped>
  header
    display: flex
    align-items: center
    justify-content: space-between
    width: 100%
    padding: 1rem

  .logo
    display: flex
    align-items: center
    gap: 1rem

  .main-title
    color: inherit
    font-size: 2rem

  img
    border-radius: 100%
    height: 4rem
    width: 4rem

  h1
    display: inline
    font-weight: 400

  .username
    cursor: pointer
    font-weight: 600
    text-decoration: underline
</style>
