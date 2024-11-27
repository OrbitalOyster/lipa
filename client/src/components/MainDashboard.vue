<script setup lang="ts">
import MyTabs from '../components/MyTabs.vue'

// eslint-disable-next-line no-useless-assignment
const slots = [
  { title: 'Исходники', icon: 'file-excel' },
  { title: 'Первичные_отчёты', icon: 'clipboard' },
  { title: 'Сводные_отчёты', icon: 'clipboard-list' },
]
</script>

<template>
  <main>
    <MyTabs :slots>
      <template #Исходники>
        <div class="bg-red-300 border border-black">
          Bar
        </div>
      </template>
      <template #Первичные_отчёты>
        <p>Foo</p>
      </template>
      <template #Сводные_отчёты>
        <p>Bar</p>
      </template>
    </MyTabs>
  </main>
</template>

<style scoped>
  main {
    @apply flex flex-col h-full;
  }
</style>
