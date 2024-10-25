<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFormStore } from '../stores/formStore.ts'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  autofocus: Boolean,
  password: Boolean,
  placeholder: {
    type: String,
    default: null,
  },
  checks: {
    type: Array,
    default: [],
  },
  storeId: {
    type: String,
    required: true,
  },
}),

type = ref(props.password ? 'password' : 'text'),
passwordHidden = ref(true),
passwordIcon = ref('eye'),

// eslint-disable-next-line no-useless-assignment
togglePassword = () => {
  passwordHidden.value = !passwordHidden.value
  passwordIcon.value = passwordHidden.value ? 'eye' : 'eye-slash'
  type.value = passwordHidden.value ? 'password' : 'text'
}

const store = useFormStore(props.storeId)
store.checks[props.name] = props.checks
store.inputs[props.name] = ''
/*
const inputRef = ref(null)

const reset = () => {
  inputRef.value.classList.remove('checked')
  delete store.errors[props.name]
}
*/

const isValid = computed(() => {
  switch (store.errors[props.name]) {
    case undefined:
      return ''
      break;
    case '':
      return 'valid'
      break;
    default:
      return 'invalid'
      break;
  }
 }
)
</script>

<template>
  <div class="flex flex-col justify-center pb-1 relative">
    <input
      v-model="store.inputs[props.name]"
      ref="inputRef"
      :class="isValid"
      :name
      :autofocus
      :placeholder
      :type
      @input="store.validate"
    >
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
      <font-awesome-icon
        v-if="password"
        @click="togglePassword"
        :icon="['fas', passwordIcon]"
        size="xl"
        class="w-8 text-slate-500 select-none cursor-pointer"
      />
    </div>
  </div>
</template>

<style scoped>
  input {
    /* Sizing */
    @apply w-full p-2 pl-4;
    /* Border */
    @apply outline-none border border-slate-300 rounded;
    /* Colors */
    @apply bg-slate-50;
    /* On focus */
    @apply focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400;
  }

  label {
    /* Sizing */
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
  input:focus + label,
  input:not(:placeholder-shown) + label {
    transform: translateY(calc(-50%)) scale(.8);
  }

  .validated input.invalid {
    @apply border-red-300 bg-pink-100;
  }

  .validated input.valid {
    @apply border-green-300 bg-green-100;
  }

  .validated input.invalid ~ .input-icons .error-triangle {
    display: block;
  }

  .input-icons {
    /* Flexbox */
    /* Sizing and position */
    @apply absolute right-3 inline-flex justify-center items-center space-x-2;
    /* Misc */
    @apply select-none;
  }

  span.password-toggle {
    /* Sizing */
    @apply w-3 inline-flex justify-center;
    /* Colors */
    @apply text-slate-500;
    /* Misc */
    @apply select-none cursor-pointer;
  }
</style>
