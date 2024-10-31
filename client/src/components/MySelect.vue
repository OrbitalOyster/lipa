<script setup lang="ts">
import { Ref, computed, nextTick, ref, useTemplateRef } from 'vue'
import { useFormStore } from '../stores/formStore.ts'

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

  selectedIndex = ref(-1),
  highlightedIndex = ref(-1),

  toggle = async () => {
    isOpen.value = !isOpen.value
    await nextTick()
    /* Scroll to selected option or to top */
    if (selectedIndex.value > -1) {
      list.value.children[selectedIndex.value].scrollIntoView()
    }
    else { list.value.scrollTop = 0 }

    highlightedIndex.value = selectedIndex.value
  },

  setValue = () => {
    store.inputs[props.name] = props.options[selectedIndex.value]
    store.validate()
  },

  keyDown = () => {
    if (isOpen.value) {
      highlightedIndex.value += 1
      if (highlightedIndex.value > props.options.length - 1) {
        highlightedIndex.value = 0
      }
      list.value.children[highlightedIndex.value].scrollIntoView()
    }
    else {
      selectedIndex.value += 1
      if (selectedIndex.value > props.options.length - 1) {
        selectedIndex.value = 0
      }
      setValue()
    }
  },

  keyUp = () => {
    if (isOpen.value) {
      highlightedIndex.value -= 1
      if (highlightedIndex.value < 0) {
        highlightedIndex.value = props.options.length - 1
      }
      list.value.children[highlightedIndex.value].scrollIntoView()
    }
    else {
      selectedIndex.value -= 1
      if (selectedIndex.value < 0) {
        selectedIndex.value = props.options.length - 1
      }
      setValue()
    }
  },

  keyEnter = async () => {
    if (isOpen.value) {
      selectedIndex.value = highlightedIndex.value
      setValue()
    }
    await toggle()
  },

  keyEsc = async () => {
    if (isOpen.value) {
      await toggle()
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
      @keydown.up="keyUp"
      @keydown.down="keyDown"
      @keydown.enter="keyEnter"
      @keydown.esc="keyEsc"
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
        :key="i"
        :class="{ highlighted: highlightedIndex === i}"
        @mouseover="highlightedIndex = i"
        @click="selectedIndex = i; setValue()"
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
