<script setup lang="ts">
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { useFormStore } from '../stores/formStore.ts'

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
    store: {
      type: String,
      default: ''
    }
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

  const store = useFormStore(props.store)
  const reset = () => {
    // inputRef.value.classList.remove('validated')
    // customError.value = ''
  }

  const validate = () => {
    store.myChecks[props.name] = true
    if (props.required && !store.myInputs[props.name]) {
      store.myChecks[props.name] = false
    }
    console.log("Validated", store.myChecks)
  }

  onMounted(() => {
    validate()
  }) 

  console.log("Parent id", getCurrentInstance().parent.props.id)
</script>

<template>
  <div class="flex flex-col justify-center pb-5">
    <input
      v-model="store.myInputs[props.name]"
      :class="placeholder ? 'p-2 pl-4 pt-6' : 'p-2 pl-4'"
      :name
      :autofocus
      :placeholder
      :type
      @input="validate"
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

  input.invalid {
    @apply border-red-300 bg-pink-100;
  }

  input.valid {
    @apply border-green-300 bg-green-100;
  }

  /*
  input.validated:invalid {
    @apply border-red-300 bg-pink-100;
  }

  input.validated:valid {
    @apply border-green-300 bg-green-100;
  }
  */

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
