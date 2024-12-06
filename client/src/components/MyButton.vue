<script setup lang="ts">
const props = defineProps<{
    title: string
    icon?: string
    submit?: boolean
    loading?: boolean
  }>(),
  // eslint-disable-next-line no-useless-assignment
  type = props.submit ? 'submit' : 'button'
</script>

<template>
  <button
    :type
    class="focusable"
  >
    <div class="space-x-3 whitespace-nowrap">
      <span v-if="title">
        {{ title }}
      </span>
      <font-awesome-icon
        v-if="icon || loading"
        :class="loading && 'fa-pulse'"
        :icon="['fas', loading ? 'spinner' : icon]"
        size="lg"
      />
    </div>
  </button>
</template>

<style scoped>
  button {
    /* Flexbox */
    @apply inline-flex items-center;
    /* Sizing */
    @apply h-14 p-3;
    /* Border */
    @apply rounded;
    /* Colors */
    @apply bg-emerald-500 text-white text-lg;
    /* Misc */
    @apply select-none;
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
  }
</style>
