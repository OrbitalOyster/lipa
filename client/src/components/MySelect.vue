<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue'

  const emits = defineEmits(['submit'])

  const props = defineProps({
      name: {
        type: String,
        required: true,
      },
      storeId: {
        type: String,
        required: true,
      },
      options: {
        type: Array<string>,
        required: true,
      },
      checks: {
        type: Array<string>,
        default: () => [],
      },
      placeholder: {
        type: String,
        default: 'Select value',
      },
    })

  const input = useTemplateRef('input')
  const isOpen = ref(false)
  const value = ref(null)

  const handleBlur = (e) => {
    isOpen.value = e.currentTarget.contains(e.relatedTarget)
  }
</script>

<template>
  <div class="input relative" ref="input" tabindex=0 @click="isOpen=!isOpen" @blur="handleBlur">
    {{ value || placeholder}}
    <div class="icon">
      <font-awesome-icon
        :icon="['fas', 'angle-down']"
        size="xl"
        class="text-slate-500"
      />
    </div>
    <div :class="{ list: true, hidden: !isOpen }" @mousedown.prevent>
      <div v-for="(option, i) in options" :key="i" class="option" @click.stop="value=option; isOpen=false; input.focus()">
        {{option}}
      </div>
    </div>
    <input class="hidden" :value>
  </div>
</template>

<style scoped>
  .input {
    /* Flexbox */
    @apply flex flex-col justify-center;
    /* Sizing */
    @apply w-full p-2 pl-4;
    /* Border */
    @apply border border-slate-300 rounded outline-none;
    /* Colors */
    @apply bg-slate-50;
    /* On focus */
    @apply focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400;
    /* Misc */
    @apply select-none cursor-pointer;
  }

  .icon {
    /* Sizing and position */
    @apply absolute top-2 right-3;
    /* Flexbox */
    @apply inline-flex justify-center items-center;
    /* Misc */
    @apply select-none;
  }

  .list {
    /* Size */
    @apply w-full max-h-64;
    /* Position */
    @apply absolute top-11 left-0 mt-1;
    /* Border */
    @apply border border-slate-300 outline-none rounded drop-shadow-md;
    /* Colors */
    @apply bg-slate-50;
    /* Misc */
    @apply overflow-auto;
  }

  .option {
    @apply p-2 cursor-pointer select-none;
  }

  .option:hover {
    @apply bg-slate-200;
  }
</style>
