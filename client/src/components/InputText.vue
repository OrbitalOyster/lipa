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

  const inputRef = ref(null)

  const reset = () => {
    inputRef.value.classList.remove('checked')
    delete store.errors[props.name]
  }

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
  <div class="flex flex-col justify-center pb-1">
    <input
      v-model="store.inputs[props.name]"
      ref="inputRef"
      :class="isValid"
      :name
      :autofocus
      :placeholder
      :type
      @input="reset"
    >
    <label>
      {{ placeholder }}
    </label>
    <div class="input-icons flex space-x-2">
      <span>
        <font-awesome-icon
          :icon="['fas', 'triangle-exclamation']"
          size="xl"
          class="text-red-400"
          :title="store.errors[props.name]"
        />
      </span>
      <span
        v-if="password"
        @click="togglePassword"
        class="password-toggle"
      >
        <font-awesome-icon
          :icon="['fas', passwordIcon]"
          size="lg"
        />
      </span>
    </div>
  </div>
</template>

<style scoped>
  div {
    position: relative;
  }

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

  input::placeholder {
    opacity: 0;
  }

  input[placeholder] {
    @apply pt-6;
  }

  input:focus + label,
  input:not(:placeholder-shown) + label {
    transform: translateY(calc(-50%)) scale(.8);
  }

  label {
    position: absolute;
    left: 1rem;
    top: 1rem;
    pointer-events: none;
    transition: transform 200ms;
    transform-origin: left;
    @apply text-slate-500;
  }

  input.invalid {
    @apply border-red-300 bg-pink-100;
  }

  input.valid {
    @apply border-green-300 bg-green-100;
  }

  .input-icons {
    /* Sizing */
    @apply right-5;

    @apply inline-flex justify-center absolute;
    /* Misc */
    @apply select-none;
  }

  span.password-toggle {
    /* Sizing */
    @apply w-3;

    @apply inline-flex justify-center cursor-pointer;
    /* Colors */
    @apply text-slate-500;
    /* Misc */
    @apply select-none;
  }
</style>
