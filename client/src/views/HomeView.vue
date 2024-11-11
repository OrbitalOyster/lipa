<script setup lang="ts">
import { useLoginStore } from '../stores/loginStore.ts'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TopBar from '../components/TopBar.vue'
import SidePanel from '../components/SidePanel.vue'
import MainDashboard from '../components/MainDashboard.vue'
import MyButton from '../components/MyButton.vue'

const loginStore = useLoginStore(),
  router = useRouter(),
  // eslint-disable-next-line no-useless-assignment
  logout = async () => {
    await loginStore.logout()
    await router.push('/login')
  }

const sidebarOut = ref(true)

</script>

<template>
  <main>
    <TopBar />
    <font-awesome-icon
      :icon="['fas', 'ellipsis-vertical']"
      size="2x"
      class="switch-button" @click="sidebarOut=!sidebarOut"
    />
    <SidePanel class="side-panel "/>
    <MainDashboard class="main-dashboard" :class="{ 'left-[34rem]': sidebarOut, 'left-[2rem]': !sidebarOut }"/>
  </main>
</template>

<style scoped>
  .switch-button {
    @apply fixed top-1/2 text-slate-600 p-3 cursor-pointer select-none;
  }

  .switch-button:hover {
    @apply text-slate-500;
  }

  .side-panel {
    /* Sizing */
    @apply w-[32rem] h-full;
    /* Position */
    @apply fixed left-8 pt-36 pb-8 pr-2;
  }

  .main-dashboard {
    @apply fixed top-0 pb-8 right-[2rem] z-30 pt-20 overflow-y-auto;
    @apply transition-all duration-300;
  }
</style>
