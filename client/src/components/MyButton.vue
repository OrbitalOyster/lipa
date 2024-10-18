<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'INSERT TITLE',
  },
  icon: {
    type: String,
    default: null,
  },
  submit: Boolean,
})
</script>

<template>
  <button type="submit ? 'submit' : 'button'">
    <div class="p-2 px-8">
      {{ title }}
      <span class="pl-1">
        <font-awesome-icon
          v-if="icon"
          :icon="['fas', icon]"
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
  }
</style>
