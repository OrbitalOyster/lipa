<script setup lang="ts">
import { Ref, computed, nextTick, ref, useTemplateRef } from 'vue'
import { useFormStore } from '../stores/formStore.ts'

let selectedIndex = -1

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
      default: null,
    },
  }),

  input: Ref<HTMLElement | null> = useTemplateRef('input'),
  list: Ref<HTMLElement | null> = useTemplateRef('list'),
  isOpen = ref(false),
  onBlur = (e: FocusEvent) => {
    /* Don't lose focus on list click */
    isOpen.value = e.relatedTarget === list.value
  },
  store = useFormStore(props.storeId),
  // eslint-disable-next-line no-useless-assignment
  isValid = computed(() => store.errors[props.name] ? 'invalid' : 'valid'),

  highlightedElement = ref(null),
  optionsRef = useTemplateRef('optionsRef'),

  toggle = async () => {
    isOpen.value = !isOpen.value
    await nextTick()
    highlightedElement.value = optionsRef.value[selectedIndex]
    highlightedElement.value?.scrollIntoView()
  },

  setValue = (i) => {
    // selectedIndex = i ?? selectedIndex 
    selectedIndex = i
    store.inputs[props.name] = props.options[i]
    store.validate()
  },

  wrap = (r, d) => (r + d + props.options.length) % props.options.length,

  onKeyScroll = (d) => {
    if (isOpen.value) {
      highlightedElement.value?.classList.remove('highlighted')
      const newIndex = wrap(optionsRef.value.indexOf(highlightedElement.value), d)
      highlightedElement.value = optionsRef.value[newIndex]
      highlightedElement.value.classList.add('highlighted')
      highlightedElement.value.scrollIntoView()
    }
    else {
      setValue(wrap(selectedIndex, d))
    }
  }

store.checks[props.name] = props.checks
store.inputs[props.name] = ''

</script>

<template>
  <div class="flex flex-col justify-center pb-1 relative">
    <div
      ref="input"
      class="select"
      :class="isValid"
      tabindex="0"
      @blur="onBlur"
      @click="toggle"
      @keydown.up="onKeyScroll(-1)"
      @keydown.down="onKeyScroll(1)"
      @keydown.enter="isOpen && setValue(optionsRef.indexOf(highlightedElement)); toggle()"
      @keydown.esc="isOpen && toggle()"
    >
      {{ store.inputs[props.name] }}
    </div>

    <label>
      {{ placeholder }}
    </label>

    <div class="input-icons">
      <font-awesome-icon
        :icon="['fas', 'triangle-exclamation']"
        size="xl"
        class="text-red-400 error-triangle hidden"
        :title="store.errors[props.name]"
      />
    </div>
    <div class="angle-icon">
      <font-awesome-icon
        :icon="['fas', 'angle-down']"
        size="xl"
        class="text-slate-500 cursor-pointer"
      />
    </div>

    <ul
      ref="list"
      tabindex="0"
      :class="{ hidden: !isOpen }"
      @click="toggle"
      @focus="input?.focus()"
    >
      <li
        v-for="(option, i) in options"
        ref="optionsRef"
        :key="i"
        @mouseover="highlightedElement = optionsRef[i]"
        :class="{ highlighted: optionsRef?.indexOf(highlightedElement) === i }"
        @click="setValue(i)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<style scoped>

  .select {
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

  label {
    /* Position */
    @apply absolute top-4 left-4;
    /* Color */
    @apply text-slate-500;
    /* Ignore pointer */
    @apply pointer-events-none;
    /* Animation */
    @apply duration-200 origin-left;
  }

  .select:empty {
    @apply h-14;
  }

  .select:not(:empty) {
    @apply pt-6 h-14;
  }

  .select:not(:empty) + label {
    transform: translateY(calc(-50%)) scale(.8);
  }

  .angle-icon {
    /* Sizing and position */
    @apply absolute right-3 space-x-2;
    /* Flexbox */
    @apply inline-flex justify-center items-center;
    /* Misc */
    @apply select-none pointer-events-none;
  }

  .input-icons {
    /* Sizing and position */
    @apply absolute right-10;
    /* Flexbox */
    @apply inline-flex justify-center items-center;
    /* Misc */
    @apply select-none;
  }

  .validated .select.invalid {
    @apply border-red-300 bg-pink-100;
  }

  .validated .select.valid {
    @apply border-green-300 bg-green-100;
  }

  .validated .select.invalid ~ .input-icons .error-triangle {
    @apply block;
  }

  ul {
    /* Size */
    @apply w-full max-h-72;
    /* Position */
    @apply absolute -bottom-72 left-0 mt-1;
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

  li.highlighted {
    @apply bg-slate-200;
  }
</style>
