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
      <img src="/goose.png">
      <h1>
        <RouterLink
          to="/"
          style="color: inherit"
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
        <strong>{{ userStore.username }}</strong>
      </div>
      <GooseButton
        :icon="faRightFromBracket"
        tooltip="Выйти из системы"
        tooltip-placement="bottom"
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

  .logo
    display: flex
    align-items: center
    gap: 1rem

  img
    border-radius: 100%
    height: 4rem
    width: 4rem

  h1
    display: inline
    font-weight: 400
</style>
