<script setup lang="ts">
import { nextTick, ref, useTemplateRef, getCurrentInstance, onMounted } from 'vue'
import { useFormStore } from '../stores/formStore.ts'

import { arrow, autoPlacement, size, flip, autoUpdate, hide, offset, useFloating } from '@floating-ui/vue'

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
  input = useTemplateRef<HTMLElement>('input'),
  // eslint-disable-next-line no-useless-assignment
  optionsRef = useTemplateRef<HTMLElement[]>('optionsRef'),
  highlightedElement = ref<HTMLElement | null>(null),

  // eslint-disable-next-line no-useless-assignment
  toggle = async () => {
    active.value = !active.value
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
    if (active.value) {
      highlightedElement.value?.classList.remove('highlighted')
      const oldIndex = getHighlightedIndex()
      setHighlighted(wrap(oldIndex ?? (d > 0 ? -1 : 0), d))
    }
    else {
      /* Edge case - nothing selected */
      selectedIndex ??= (d > 0 ? -1 : 0)
      setValue(wrap(selectedIndex, d))
    }
  }

const offsetValue = props.arrow ? 16 : 2

const target = ref(null),
  floating = ref(null),
  elements = {floating: floating.value},
  { floatingStyles, middlewareData } = useFloating(target, floating, {
    placement: 'bottom',
    middleware: [
      offset({mainAxis: offsetValue}),
      flip(),
      size({
        apply({availableWidth, availableHeight, rects, elements}) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.max(128, availableWidth)}px`,
            maxHeight: `${Math.max(128, availableHeight - 32)}px`,
            minWidth1: `${rects.reference.width}px`,
            width: `${rects.reference.width}px`,
            width1: `100px`,
          });
        },
      }),
      hide(),
    ],
    whileElementsMounted: autoUpdate,
  }),
  active = ref(false)


store.checks[props.name] = props.checks
store.inputs[props.name] = ''

</script>

<template>

    <div ref="target" class="flex flex-col justify-center pb-1 relative">
      <div
        ref="input"
        class="select"
        :class="store.errors[props.name] ? 'invalid' : 'valid'"
        tabindex="0"
        @blur="e => active && e.relatedTarget !== floating && toggle()"
        @click="toggle"
        @keydown.up="keyScroll(-1)"
        @keydown.down="keyScroll(1)"
        @keydown.enter="active && getHighlightedIndex() !== null && setValue(getHighlightedIndex()); toggle()"
        @keydown.esc="active && toggle()"
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
    </div>

      <ul
        tabindex="0"
        @click="toggle"
    

      ref="floating"
      class="floating"
      @focus="input?.focus()"
      :style="[
        floatingStyles, { 
          display: (middlewareData.hide?.referenceHidden || !active) ? 'none' : 'block',
        }
      ]"

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

</template>

<style scoped>

  .floating {
    @apply absolute top-0 left-0;
    @apply outline-none border border-red-300 rounded overflow-auto;
    @apply bg-white;
    @apply drop-shadow;
  }

  .select {
    /* Flexbox */
    @apply flex flex-col justify-center;
    /* Sizing */
    @apply w-full p-2 pl-4;
    /* Border */
    @apply outline-none border border-slate-300 rounded;
    /* Colors */
    @apply bg-slate-50;
    /* Misc */
    @apply select-none cursor-pointer;
    /* Animation */
    @apply transition duration-200 ease-in-out;
  }

  /* On focus */
  .select:focus {
    @apply focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400;
  }

  /* On hover */
  .select:hover {
    @apply hover:border-slate-400;
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
    /* @apply w-full max-h-72; */
    /* @apply w-full; */
    /* Position */
    /* @apply absolute -bottom-72 left-0 mt-1; */
    /* Border */
    /* @apply border border-slate-300 outline-none rounded drop-shadow-md; */
    /* Colors */
    @apply bg-slate-50;
    /* Misc */
    /* @apply overflow-auto; */
  }

  li {
    @apply p-2 cursor-pointer select-none;
  }

  li.highlighted {
    @apply bg-slate-200;
  }
</style>
