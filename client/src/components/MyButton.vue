<script setup lang="ts">
import { useTemplateRef } from 'vue'

const props = defineProps<{
    title: string
    icon?: string
    submit?: boolean
    loading?: boolean
  }>(),
  // eslint-disable-next-line no-useless-assignment
  type = props.submit ? 'submit' : 'button',
  button = useTemplateRef<HTMLElement>('button'),
  focus = () => button.value?.focus(),
  blur = () => button.value?.blur()
defineExpose({ focus, blur })
</script>

<template>
  <button
    ref="button"
    :type
    class="focusable"
  >
    <div class="space-x-2 whitespace-nowrap">
      <span v-if="title">
        {{ title }}
      </span>
      <span v-if="icon || loading">
        <font-awesome-icon
          v-if="icon && !loading"
          :icon="['fas', icon]"
          size="lg"
        />
        <font-awesome-icon
          v-if="loading"
          class="fa-pulse"
          :icon="['fas', 'spinner']"
          size="lg"
        />
      </span>
    </div>
  </button>
</template>

<style scoped>
  button {
    /* Flexbox */
    @apply inline-flex items-center;
    /* Sizing */
    @apply h-12 p-3;
    /* Border */
    @apply outline-none rounded;
    /* Colors */
    @apply bg-emerald-500 text-white text-lg;
    /* Misc */
    @apply select-none;
    /* Animation */
    @apply duration-200;
  }

  /* On hover */
  button:hover {
    @apply hover:bg-emerald-400 hover:drop-shadow-md;
  }

    /* On active */
  button:active {
    @apply active:drop-shadow-none active:bg-emerald-700;
    /* apply scale-95; */
  }

  button:disabled {
    /* Colors */
    @apply bg-zinc-200 text-slate-400;
    /* On hover */
    @apply hover:drop-shadow-none hover:bg-zinc-200;

    @apply cursor-not-allowed;
  }
</style>
