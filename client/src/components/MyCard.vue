<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()
</script>

<template>
  <div class="card p-4 space-y-4">
    <header class="flex justify-between">
      <div class="flex flex-col">
        <h1 class="text-3xl font-bold text-slate-600">
          {{ title }}
        </h1>
        <h2 class="text-lg text-slate-400">
          {{ subtitle }}
        </h2>
      </div>
      <img
        v-if="icon"
        :src="icon"
        class="w-16 h-16 rounded-full"
      >
    </header>
    <slot />
  </div>
</template>
