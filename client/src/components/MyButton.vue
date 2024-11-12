<script setup lang="ts">
import { useTemplateRef } from 'vue'
const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: null,
    },
    submit: Boolean,
    loading: Boolean,
  }),
  // eslint-disable-next-line no-useless-assignment
  type = props.submit ? 'submit' : 'button',
  button = useTemplateRef<HTMLElement>('button'),
  focus = () => {
    if (!button.value) {
      throw new Error('Major screwup')
    }
    button.value.focus()
  },
  blur = () => {
    if (!button.value) {
      throw new Error('Major screwup')
    }
    button.value.blur()
  }
defineExpose({ focus, blur })
</script>

<template>
  <button
    ref="button"
    :type
  >
    <div class="space-x-2 whitespace-nowrap">
      <span v-if="title">
        {{ title }}
      </span>
      <span v-if="icon || loading">
        <font-awesome-icon
          v-if="icon && !loading"
          :icon="['fas', icon]"
          size="xl"
        />
        <font-awesome-icon
          v-if="loading"
          class="animate-spin"
          :icon="['fas', 'spinner']"
          size="xl"
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
