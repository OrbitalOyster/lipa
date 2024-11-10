<script setup lang="ts">
  import MainDashboard from '../components/MainDashboard.vue'
  import { ref } from 'vue'
  import MyAccordion from '../components/MyAccordion.vue'
  import LoremIpsum from '../components/LoremIpsum.vue'

  const slots = [
    {title: "Организации", icon: 'hospital'},
    {title: "Формы", icon: 'clipboard'},
    {title: "Статусы", icon: 'pencil'}
  ]

</script>

<template>
  <main>
    <MyAccordion class="h-full" :slots>
      <template #Организации>
        <p><LoremIpsum /></p>
      </template>
      <template #Формы>
        <p>Bar</p>
      </template>
    </MyAccordion>
 </main>
</template>

<style scoped>
  main {
    @apply w-[32rem] fixed top-0 left-8 z-10 h-screen pt-20 pb-6 pr-2;
  }
</style>
