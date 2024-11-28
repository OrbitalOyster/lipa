<script setup lang="ts">
import LoremIpsum from '@components/LoremIpsum.vue'
import MyAccordion from '@components/MyAccordion.vue'

// eslint-disable-next-line no-useless-assignment
const slots = [
  { title: 'Организации', icon: 'hospital' },
  { title: 'Формы', icon: 'clipboard' },
  { title: 'Статусы', icon: 'pencil' },
]
</script>

<template>
  <main>
    <MyAccordion :slots>
      <template #Организации>
        <p><LoremIpsum /></p>
      </template>
      <template #Формы>
        <p>Bar</p>
      </template>
    </MyAccordion>
  </main>
</template>
