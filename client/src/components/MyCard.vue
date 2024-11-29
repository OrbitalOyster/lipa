<script setup lang="ts">
import MyContainer from '@components/base/MyContainer.vue'

defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()
</script>

<template>
  <MyContainer class="p-4 space-y-4">
    <header>
      <img
        v-if="icon"
        :src="icon"
        class="float-right w-16 h-16 rounded-full"
      >
      <h1 class="text-3xl font-bold text-slate-600">
        {{ title }}
      </h1>
      <h2 class="text-lg text-slate-400">
        {{ subtitle }}
      </h2>
    </header>
    <slot />
  </MyContainer>
</template>
