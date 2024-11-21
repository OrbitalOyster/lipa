<script setup lang="ts">
import { autoUpdate, hide, size, useFloating } from '@floating-ui/vue'
import { nextTick, ref, useTemplateRef } from 'vue'
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
  store = useFormStore(props.storeId),
  active = ref(false),
  optionsRef = useTemplateRef<HTMLElement[]>('optionsRef'),
  placement = 'bottom',
  minDistanceToBottom = 32,
  minHeight = 128,
  selectedIndex = ref<null | number>(null),
  scrollToSelected = () => {
    if (selectedIndex.value !== null && optionsRef.value !== null) {
      const highlightedElement = optionsRef.value[selectedIndex.value],
        behavior = active.value ? 'smooth' : 'instant'
      highlightedElement.scrollIntoView({ behavior, block: 'center' })
    }
  },
  // eslint-disable-next-line no-useless-assignment
  toggle = async () => {
    active.value = !active.value
    await nextTick()
    scrollToSelected()
  },
  setValue = (ind: number | null) => {
    selectedIndex.value = ind
    /* Resetting value? */
    if (ind === null) {
      store.inputs[props.name] = ''
    }
    else {
      store.inputs[props.name] = props.options[ind]
      scrollToSelected()
    }
    store.validate()
  },
  wrap = (r: number, d: number) => (r + d + props.options.length) % props.options.length,
  // eslint-disable-next-line no-useless-assignment
  keyScroll = (d: number) => {
    /* Edge case - nothing selected */
    selectedIndex.value ??= (d > 0 ? -1 : 0)
    setValue(wrap(selectedIndex.value, d))
  },
  target = ref<HTMLElement | null>(null),
  floating = ref(null),
  // eslint-disable-next-line no-useless-assignment
  { floatingStyles } = useFloating(target, floating, {
    placement,
    middleware: [
      size({
        apply({ availableWidth, availableHeight, rects, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(minHeight, availableHeight - minDistanceToBottom).toString()}px`,
            width: `${rects.reference.width.toString()}px`,
          })
        },
      }),
      hide(),
    ],
    whileElementsMounted: autoUpdate,
  })

store.checks[props.name] = props.checks
store.inputs[props.name] = ''

</script>

<template>
  <div class="flex flex-col justify-center pb-1 relative">
    <div
      ref="target"
      class="select "
      :class="store.errors[props.name] ? 'invalid' : 'valid'"
      tabindex="0"
      @blur="e => active && e.relatedTarget !== floating && toggle()"
      @click="toggle"
      @keydown.up="keyScroll(-1)"
      @keydown.down="keyScroll(1)"
      @keydown.enter="toggle()"
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
    <div class="angle-icon"
        :class="{ 'rotate-180': active }"
    >
      <font-awesome-icon
        :icon="['fas', 'angle-down']"
        size="xl"
      />
    </div>

    <ul
      ref="floating"
      tabindex="0"
      class="floating"
      :style="[
        floatingStyles, {
          opacity: active ? 1 : 0,
          visibility: active ? 'visible' : 'hidden',
        }
      ]"
      @focus="target?.focus()"
    >
      <li
        v-for="(option, i) in options"
        ref="optionsRef"
        :key="i"
        :class="{ highlighted: selectedIndex === i }"
        @click="setValue(i); toggle();"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<style scoped>

  .floating {
    @apply absolute top-0 left-0 mt-2 z-50;
    @apply outline-none border border-slate-300 rounded overflow-auto;
    @apply bg-white;
    @apply drop-shadow;
    @apply transition-all duration-200;
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
    @apply text-slate-500 cursor-pointer transition-transform;

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

  li {
    @apply p-2 cursor-pointer select-none;
  }

  li:hover, li.highlighted {
    @apply bg-slate-200;
  }
</style>
