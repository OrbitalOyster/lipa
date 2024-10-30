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
  const list = useTemplateRef('list')

  const isOpen = ref(false)
  const value = ref(null)

  const onBlur = (e) => {
    /* Don't lose focus on list click */
    isOpen.value = e.relatedTarget === list.value
  }
</script>

<template>
  <div class="relative">
    <input tabindex="0" type="text" readonly :value="value || placeholder" ref="input" @blur="onBlur" @click="isOpen=!isOpen">
    <div class="angle-icon">
      <font-awesome-icon
        :icon="['fas', 'angle-down']"
        size="xl"
        class="text-slate-500"
      />
    </div>
    <ul tabindex="0" ref="list" :class="{ hidden: !isOpen }" @click="isOpen=false" @focus="input.focus()">
      <li v-for="option in options" @click="value=option">
        {{option}}
      </li>
    </ul>
  </div>
</template>

<style scoped>

  input {
    /* Flexbox */
    @apply flex flex-col justify-center;
    /* Sizing */
    @apply w-full p-2 pl-4;
    /* Border */
    @apply outline-none border border-slate-300 rounded;
    /* Colors */
    @apply bg-slate-50;
    /* On focus */
    @apply focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400;
    /* Misc */
    @apply select-none cursor-pointer;
  }

  .angle-icon {
    /* Sizing and position */
    @apply absolute top-2 right-3;
    /* Flexbox */
    @apply inline-flex justify-center items-center;
    /* Misc */
    @apply select-none pointer-events-none;
  }

  ul {
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

  li {
    @apply p-2 cursor-pointer select-none;
  }

  li:hover {
    @apply bg-slate-200;
  }
</style>
