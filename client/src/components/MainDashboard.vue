<script setup lang="ts">
import MyLink from '@components/MyLink.vue'
import MyTabs from '@components/MyTabs.vue'

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
        <MyLink
          to="/form"
          title="Sample Form"
        />
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
