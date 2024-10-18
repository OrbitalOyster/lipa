<script setup lang="ts">
const props = defineProps({
    title: {
      type: String,
      default: 'INSERT TITLE',
    },
    icon: {
      type: String,
      default: null,
    },
    submit: Boolean,
    loading: Boolean,
  }),
  // eslint-disable-next-line no-useless-assignment
  type = props.submit ? 'submit' : 'button'
</script>

<template>
  <button :type>
    <div class="p-2 px-8">
      {{ title }}
      <span class="pl-1">
        <font-awesome-icon
          v-if="icon && !loading"
          :icon="['fas', icon]"
          size="lg"
        />
        <font-awesome-icon
          class="animate-spin"
          v-if="loading"
          :icon="['fas', 'spinner']"
          size="lg"
        />
      </span>
    </div>
  </button>
</template>

<style scoped>
  button {
    /* Border */
    @apply outline-none rounded;
    /* Colors */
    @apply bg-emerald-500 text-white;
    /* On hover */
    @apply hover:bg-emerald-400 hover:drop-shadow-md;
    /* On focus */
    @apply focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400;
    /* On active */
    @apply active:bg-emerald-700;
    /* Misc */
    @apply select-none;
  }

  button:disabled {
    /* Colors */
    @apply bg-zinc-200 text-slate-400;
    /* On hover */
    @apply hover:drop-shadow-none;
  }
</style>
