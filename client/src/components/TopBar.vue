<template>
  <main class="flex items-center justify-between bg-indigo-200/50 h-16">
    <div class="flex items-center space-x-2">
      <img class="rounded-full w-12 h-12"
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
    <span class="button">
      <font-awesome-icon
        :icon="['fas', 'user']"
        size="xl"
      />
    </span>
  </main>
</template>

<style scoped>
  main {
    @apply px-4 py-2;
  }

  a {
    @apply text-3xl font-bold text-slate-600 underline;
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
