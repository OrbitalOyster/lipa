<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps({
  name: String, 
  autofocus: Boolean,
  password: Boolean,
  placeholder: {
    type: String,
    default: '',
  },
  required: Boolean,
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

const inputRef = ref(null)

const validate = (e) => {
  e.preventDefault()
  e.stopPropagation()
  inputRef.value.setCustomValidity('WUT?!')
  console.log('Validate here')
}

onMounted(() => {inputRef.value.setCustomValidity('')})

</script>

<template>
  <div>
    <input
      v-model="model"
      ref="inputRef"
      :name
      :autofocus
      :placeholder
      :type
      :oninput="validate"
      :oninvalid="validate"
    >
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
  input {
    /* Sizing */
    @apply w-full p-2;
    /* Border */
    @apply outline-none border border-slate-300 rounded;
    /* Colors */
    @apply bg-slate-50;
    /* On focus */
    @apply focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400;
  }

  .validated input:invalid {
    @apply border-red-300;
    @apply bg-pink-100;
  }

  .validated input:valid {
    @apply border-green-300;
    @apply bg-green-100;
  }

  span {
    /* Sizing */
    @apply w-3 p-3 right-6;

    @apply inline-flex justify-center absolute cursor-pointer;
    /* Colors */
    @apply text-slate-500;
    /* Misc */
    @apply select-none;
  }
</style>
