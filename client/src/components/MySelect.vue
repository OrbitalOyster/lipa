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

  const onBlur = (e) => {
    /* Don't lose focus on list click */
    isOpen.value = e.currentTarget.contains(e.relatedTarget)
  }
</script>

<template>
  <div class="focusable relative" tabindex="0" ref="input" @blur="onBlur">
    <div class="input" @click="isOpen=!isOpen">
      {{ value || placeholder}}
      <div class="icon">
        <font-awesome-icon
          :icon="['fas', 'angle-down']"
          size="xl"
          class="text-slate-500"
        />
      </div>
    </div>
    <div tabindex="0" :class="{ list: true, hidden: !isOpen }" @click="isOpen=false" @focus="input.focus()">
      <div v-for="option in options" class="option" @click="value=option">
        {{option}}
      </div>
    </div>
    <input class="hidden" :value>
  </div>
</template>

<style scoped>

  .focusable {
    /* Border */
    @apply rounded outline-none;
    /* On focus */
    @apply focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400;
  }

  .input {
    /* Flexbox */
    @apply flex flex-col justify-center;
    /* Sizing */
    @apply w-full p-2 pl-4;
    /* Border */
    @apply border border-slate-300 rounded;
    /* Colors */
    @apply bg-slate-50;
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
