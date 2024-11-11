<script setup lang="ts">
  import MyTabs from '../components/MyTabs.vue'
  import MyButton from '../components/MyButton.vue'

  const slots = [
    {title: "Исходники", icon: 'file-excel'},
    {title: "Первичные_отчёты", icon: 'hospital'},
    {title: "Сводные_отчёты", icon: 'clipboard'},
  ]
</script>

<template>
  <main>
    <MyTabs :slots >
      <template #Исходники>
        <p>Bar</p>
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
