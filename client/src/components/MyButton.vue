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
          v-if="loading"
          class="animate-spin"
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
    /* Misc */
    @apply select-none;
    /* Animation */
    @apply transition duration-200 ease-in-out;
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
