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

<nav class="fixed top-0 z-50 w-full bg-pink-300">
  <TopBar />
</nav>

<aside :class="{ 'w-80': sidebarOut, 'w-0': !sidebarOut }">
   <div class="h-full overflow-y-auto">
     <MainDashboard />
   </div>
</aside>

<div class="main" :class="{ 'left-80': sidebarOut, 'left-0': !sidebarOut }">
  <MyButton title="toggle" @click="sidebarOut=!sidebarOut"/>
  <MainDashboard />
</div>

</template>

<style scoped>
  aside {
    @apply fixed top-0 left-0 z-10 h-screen pt-16 bg-blue-200;
    @apply transition-all duration-100;
  }

  .main {
    @apply absolute right-0 z-30 pt-16 bg-green-200 overflow-y-auto;
    /* @apply pt-16 bg-green-200; */
    @apply transition-all duration-100;
  }
</style>
