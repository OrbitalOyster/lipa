<script setup lang="ts">
defineProps<{
  title: string
  to: string
}>()
</script>

<template>
  <RouterLink
    v-slot="{ navigate }"
    :to
    custom
  >
    <button
      role="link"
      @click="navigate"
    >
      {{ title }}
    </button>
  </RouterLink>
</template>

<style scoped>
  button {
    /* Sizing */
    @apply p-3 px-6;
    /* Border */
    @apply outline-none rounded;
    /* Colors */
    @apply bg-emerald-500 text-white text-lg;
    /* Misc */
    @apply select-none;
    /* Animation */
    @apply duration-200;
  }

  /* On focus */
  button:focus {
    @apply focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400;
  }

  /* On hover */
  button:hover {
    @apply hover:bg-emerald-400 hover:drop-shadow-md;
  }

    /* On active */
  button:active {
    @apply active:drop-shadow-none active:bg-emerald-700;
  }

  button:disabled {
    /* Colors */
    @apply bg-zinc-200 text-slate-400;
    /* On hover */
    @apply hover:drop-shadow-none hover:bg-zinc-200;

    @apply cursor-not-allowed;
  }
</style>
