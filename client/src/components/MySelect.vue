<script setup lang="ts">
import { Ref, nextTick, ref, useTemplateRef } from 'vue'
import { useFormStore } from '../stores/formStore.ts'

let selectedIndex: null | number = null

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
  store = useFormStore(props.storeId),
  // eslint-disable-next-line no-useless-assignment
  input: Ref<HTMLElement | null> = useTemplateRef('input'),
  // eslint-disable-next-line no-useless-assignment
  list: Ref<HTMLElement | null> = useTemplateRef('list'),
  optionsRef = useTemplateRef<HTMLElement[]>('optionsRef'),
  highlightedElement = ref<HTMLElement | null>(null),
  isOpen = ref(false),

  // eslint-disable-next-line no-useless-assignment
  toggle = async () => {
    isOpen.value = !isOpen.value
    await nextTick()
    if (!optionsRef.value) {
      throw new Error('Major screwup')
    }
    if (selectedIndex !== null) {
      highlightedElement.value = optionsRef.value[selectedIndex]
      highlightedElement.value.scrollIntoView()
    }
  },

  setValue = (ind: number | null) => {
    selectedIndex = ind
    /* Resetting value? */
    if (ind === null) {
      store.inputs[props.name] = ''
    }
    else { store.inputs[props.name] = props.options[ind] }

    store.validate()
  },

  wrap = (r: number, d: number) => (r + d + props.options.length) % props.options.length,

  getHighlightedIndex = () => {
    if (highlightedElement.value === null) {
      return null
    }
    if (!optionsRef.value) {
      throw new Error('Major screwup')
    }
    return optionsRef.value.indexOf(highlightedElement.value)
  },

  setHighlighted = (ind: number) => {
    if (!optionsRef.value) {
      throw new Error('Major screwup')
    }
    highlightedElement.value = optionsRef.value[ind]
    highlightedElement.value.classList.add('highlighted')
    highlightedElement.value.scrollIntoView()
  },

  // eslint-disable-next-line no-useless-assignment
  keyScroll = (d: number) => {
    if (isOpen.value) {
      highlightedElement.value?.classList.remove('highlighted')
      const oldIndex = getHighlightedIndex()
      if (oldIndex !== null) {
        setHighlighted(wrap(oldIndex, d))
      }
    }
    else {
      /* Edge case - nothing selected */
      selectedIndex ??= (d > 0 ? -1 : 0)
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
      :class="store.errors[props.name] ? 'invalid' : 'valid'"
      tabindex="0"
      @blur="e => isOpen = e.relatedTarget === list"
      @click="toggle"
      @keydown.up="keyScroll(-1)"
      @keydown.down="keyScroll(1)"
      @keydown.enter="isOpen && getHighlightedIndex() && setValue(getHighlightedIndex()); toggle()"
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
        :class="{ highlighted: getHighlightedIndex() === i }"
        @mouseover="highlightedElement = optionsRef?.[i] || null"
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
