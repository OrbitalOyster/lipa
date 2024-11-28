<script setup lang="ts">
import MyPopover from '@components/MyPopover.vue'
import UserCard from '@components/UserCard.vue'
</script>

<template>
  <main>
    <div class="flex items-center space-x-3">
      <img
        class="rounded-full w-12 h-12"
        src="/goose.png"
      >
      <RouterLink to="/">
        Lipa
      </RouterLink>
    </div>
    <div class="flex flex-col items-center">
      <h1>Главная</h1>
      <h2>Отчёты</h2>
    </div>
    <MyPopover
      placement="bottom"
      has-arrow
      click-toggle
    >
      <span
        class="button"
      >
        <font-awesome-icon
          :icon="['fas', 'user']"
          size="xl"
        />
      </span>

      <template #popover>
        <UserCard />
      </template>
    </MyPopover>
  </main>
</template>

<style scoped>
  main {
    @apply fixed w-full px-8 py-4 h-20 top-0 z-50;
    @apply flex items-center justify-between backdrop-blur;
  }

  a {
    @apply text-3xl font-bold text-slate-600 underline outline-none;
  }

  h1 {
    @apply text-2xl text-slate-600;
  }

  h2 {
    @apply text-lg text-slate-500;
  }

  span.button {
    @apply flex justify-center items-center rounded-full w-10 h-10;
    @apply text-emerald-500 cursor-pointer select-none;
  }

  span.button:hover {
    @apply text-emerald-400;
    @apply bg-white/50
  }

  span.button:active {
    @apply text-emerald-700
  }

</style>
