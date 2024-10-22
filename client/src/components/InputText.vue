<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
const props = defineProps({
    name: {
      type: String,
      default: 'INSERT FORM NAME',
    },
    autofocus: Boolean,
    password: Boolean,
    placeholder: {
      type: String,
      default: '',
    },
    required: Boolean,
    foo: {
      type: String,
      default: 'INSERT FOO',
    },
  }),
  // eslint-disable-next-line no-useless-assignment
  model = defineModel<string>(),

  type = ref(props.password ? 'password' : 'text'),
  passwordHidden = ref(true),
  passwordIcon = ref('eye'),

  // eslint-disable-next-line no-useless-assignment
  togglePassword = () => {
    passwordHidden.value = !passwordHidden.value
    passwordIcon.value = passwordHidden.value ? 'eye' : 'eye-slash'
    type.value = passwordHidden.value ? 'password' : 'text'
  }
</script>

<template>
  <div class="flex items-center">
    <input
      v-model="model"
      ref="inputRef"
      :class="placeholder ? 'p-2 pl-4 pt-6' : 'p-2 pl-4'"
      :name
      :autofocus
      :placeholder
      :type
      data-lipa="form-input"
      :required
      :data-foo="foo"
      @input="$el.firstChild.classList.remove('validated')"
    >
    <label>
      {{ placeholder }}
    </label>
    <span
      v-if="password"
      @click="togglePassword"
    >
      <font-awesome-icon
        :icon="['fas', passwordIcon]"
        size="lg"
      />
    </span>
  </div>
</template>

<style scoped>
  div {
    position: relative;
  }

  input {
    /* Sizing */
    @apply w-full;
    /*padding-top: v-bind('placeholder ? "1.5rem" : ".5rem"');*/
    /* : v-bind('placeholder ? "1.5rem" : ".5rem"'); */
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

  input.validated:invalid {
    @apply border-red-300 bg-pink-100;
  }

  input.validated:valid {
    @apply border-green-300 bg-green-100;
  }

  span {
    /* Sizing */
    @apply w-3 right-5;

    @apply inline-flex justify-center absolute cursor-pointer;
    /* Colors */
    @apply text-slate-500;
    /* Misc */
    @apply select-none;
  }
</style>
