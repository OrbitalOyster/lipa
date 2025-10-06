<script setup lang="ts">
import { faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import GooseButton from '#components/GooseButton.vue'
import GooseConfirm from '#components/GooseConfirm.vue'
import { useLocalSettings } from '#stores/useLocalSettings.ts'
import { useRouter } from 'vue-router'
import { useTemplateRef } from 'vue'
import { useUserStore } from '#stores/useUserStore.ts'

const localSettings = useLocalSettings(),
  userStore = useUserStore(),
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
    <GooseButton
      transparent
      :icon="faBars"
      @click="localSettings.sideBarToggled = !localSettings.sideBarToggled"
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
        tooltip-side="bottom"
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

  .username
    cursor: pointer
    display: inline
    font-weight: 600
    text-decoration: underline
</style>
