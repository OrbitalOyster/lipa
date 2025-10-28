<script setup lang="ts">
import { faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import GooseButton from '#components/GooseButton.vue'
import GooseConfirm from '#components/GooseConfirm.vue'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useTemplateRef } from 'vue'
import { useUserStore } from '#stores/useUserStore.ts'

const userStore = useUserStore(),
  router = useRouter(),
  logoutConfirm = useTemplateRef('logoutConfirm'),
  sidebarToggled = useLocalStorage('sidebar-toggled', true)

async function logout() {
  await userStore.logout()
  await router.push('/login')
}
</script>

<template>
  <GooseConfirm
    ref="logoutConfirm"
    @submit="logout"
  />
  <header>
    <GooseButton
      large
      transparent
      :icon="faBars"
      @click="sidebarToggled = !sidebarToggled"
    />
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
        <div class="username">
          {{ userStore.name }}
        </div>
      </div>
      <GooseButton
        :icon="faRightFromBracket"
        tooltip="Выйти из системы"
        color="warning"
        @click="logoutConfirm?.show('Выйти из системы?')"
      />
    </div>
  </header>
</template>

<style lang="sass" scoped>
  header
    align-items: center
    box-sizing: border-box
    display: flex
    justify-content: space-between
    padding: 1rem
    width: 100%

  .username
    cursor: pointer
    display: inline
    font-weight: 600
    text-decoration: underline
</style>
