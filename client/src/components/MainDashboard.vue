<script setup lang="ts">
  import MyTabs from '../components/MyTabs.vue'
  import MyButton from '../components/MyButton.vue'

  const slots = [
    {title: "Первичные_отчёты", icon: 'hospital'},
    {title: "Сводные_отчёты", icon: 'clipboard'},
  ]
</script>

<template>
  <MyTabs :slots>
    <template #toolbar>
      <MyButton icon="fa-plus" />
    </template>
    <template #Первичные_отчёты>
      <p>Foo</p>
    </template>
    <template #Сводные_отчёты>
      <p>Bar</p>
    </template>
  </MyTabs>
</template>
