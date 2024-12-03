<script setup lang="ts">
import MainDashboard from '@components/MainDashboard.vue'
import SidePanel from '@components/SidePanel.vue'
import TopBar from '@components/TopBar.vue'
import { ref } from 'vue'

// eslint-disable-next-line no-useless-assignment
const sidepanel = ref(true)
</script>

<template>
  <main>
    <TopBar />
    <font-awesome-icon
      :icon="['fas', 'ellipsis-vertical']"
      size="2x"
      class="switch-button"
      @click="sidepanel=!sidepanel"
    />
    <SidePanel
      class="side-panel h-full fixed left-8 pt-24 pb-8 pr-2 w-[32rem] origin-left transition-[transform] ease-in-out duration-100"
      :style="{ transform: sidepanel ? 'scaleX(1)' : 'scaleX(0)' }"
    />
    <MainDashboard
      class="fixed top-0 pb-8 right-8 z-30 pt-20 overflow-y-auto transition-[left] duration-100 ease-in-out"
      :class="{ 'left-[34rem]': sidepanel, 'left-[2rem]': !sidepanel }"
    />
  </main>
</template>

<style scoped>
  .switch-button {
    @apply fixed top-1/2 text-slate-600 p-3 cursor-pointer select-none;
  }

  .switch-button:hover {
    @apply text-slate-500;
  }
</style>
