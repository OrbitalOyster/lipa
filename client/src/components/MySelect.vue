<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
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
})

const input = useTemplateRef('input'),
  list = useTemplateRef('list'),
  isOpen = ref(false),
  onBlur = (e: FocusEvent) => {
    /* Don't lose focus on list click */
    isOpen.value = e.relatedTarget === list.value
  },
  store = useFormStore(props.storeId),
  // eslint-disable-next-line no-useless-assignment
  isValid = computed(() => store.errors[props.name] ? 'invalid' : 'valid')

store.checks[props.name] = props.checks
store.inputs[props.name] = ''

const selectedIndex = ref(-1)
const highlightedIndex = ref(-1)

const toggle = async () => {
  isOpen.value = !isOpen.value 
  await nextTick()
  /* Scroll to selected option or to top */
  if (selectedIndex.value !== -1)
    list.value.children[selectedIndex.value].scrollIntoView()
  else
    list.value.scrollTop = 0

  highlightedIndex.value = selectedIndex.value
}

const setValue = () => {
  store.inputs[props.name] = props.options[selectedIndex.value]
  store.validate()
}

const keyDown = () => {
  if (isOpen.value) {
    highlightedIndex.value++
    if (highlightedIndex.value > props.options.length - 1) {
      highlightedIndex.value = 0
    }
    list.value.children[highlightedIndex.value].scrollIntoView()
    return
  }
  selectedIndex.value++
  if (selectedIndex.value > props.options.length - 1) {
    selectedIndex.value = 0
  }
  setValue()
}

const keyUp = () => {
  if (isOpen.value) {
    highlightedIndex.value--
    if (highlightedIndex.value < 0) {
      highlightedIndex.value = props.options.length - 1
    }
    list.value.children[highlightedIndex.value].scrollIntoView()
    return
  }
  selectedIndex.value--
  if (selectedIndex.value < 0) {
    selectedIndex.value = props.options.length - 1
  }
  setValue()
}

const keyEnter = () => {
  if (!isOpen.value) {
    toggle()
  } else {
    selectedIndex.value = highlightedIndex.value
    setValue()
    toggle()
  }
}

const keyEsc = () => {
  if (isOpen.value)
    toggle()
}
</script>

<template>
  <div class="flex flex-col justify-center pb-1 relative">
    <div class="input"
      ref="input"
      :class="isValid"
      :name
      tabindex="0"
      type="text"
      readonly
      :placeholder
      :value="store.inputs[props.name]"
      @blur="onBlur"
      @click="toggle"
      @keydown.up="keyUp"
      @keydown.down="keyDown"
      @keydown.enter="keyEnter"
      @keydown.esc="keyEsc"
    >
      {{store.inputs[props.name] || placeholder}}
    </div>

    <!--
    <label>
      {{ placeholder }}
    </label>
    -->

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
        @mouseover="highlightedIndex = i"
        :class="{ highlighted: highlightedIndex === i}"
        @click="selectedIndex=i; setValue()"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<style scoped>

  .input {
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

  /* Hide original placeholder */
  input::placeholder {
    @apply opacity-0;
  }

  /* Inputs with placeholders are bigger */
  input[placeholder] {
    @apply pt-6;
  }

  /* Shrink and translate label if:
   * - input is focused
   * - placeholder not shown */
  input:not(:placeholder-shown) + label {
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

  .validated .input.invalid {
    @apply border-red-300 bg-pink-100;
  }

  .validated .input.valid {
    @apply border-green-300 bg-green-100;
  }

  .validated .input.invalid ~ .input-icons .error-triangle {
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

  /*
  li:hover {
    @apply bg-slate-200;
  }
  */

  li.highlighted {
    @apply bg-slate-200;
  }
</style>
