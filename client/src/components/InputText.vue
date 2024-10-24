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
    lessThanTo: Boolean,
    moreThanFrom: Boolean,
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

  const errorMessage = ref('')
  const isValid = ref('invalid')

  const validate = () => {
    store.errors[props.name] = ''
    const value = store.myInputs[props.name]

    if (props.required && !value) {
      store.errors[props.name] = 'Value required'
    }

    if (props.lessThanTo && (store.myInputs['to'] === '' || Number(value) >= Number(store.myInputs['to']))) {
      store.errors[props.name] = 'Must be less than to'
    }

    if (props.moreThanFrom && (!store.myInputs['from'] || Number(value) <= Number(store.myInputs['from']))) {
      store.errors[props.name] = 'Must be more than from'
    }

    isValid.value = store.errors[props.name]  === '' ? 'valid' : 'invalid'
  }

  onMounted(() => {
    validate()
  }) 

//  console.log("Parent id", getCurrentInstance().parent.props.id)
</script>

<template>
  <div class="flex flex-col justify-center pb-1">
    <input
      v-model="store.myInputs[props.name]"
      :class="placeholder ? `p-2 pl-4 pt-6 ${isValid}` : `p-2 pl-4 ${isValid}`"
      :name
      :autofocus
      :placeholder
      :type
      @input="validate"
    >
    <label>
      {{ placeholder }}
    </label>
    <p>{{store.errors[props.name]}}</p>
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
    /* @apply p-2 pl-4; */
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
