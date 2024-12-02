<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MyFormCheck } from '@stores/formStore.ts'
import { useFormStore } from '@stores/formStore.ts'

const props = defineProps<{
    name: string
    value?: string
    storeId: string
    checks?: MyFormCheck[]
    autofocus?: boolean
    password?: boolean
    disabled?: boolean
    placeholder?: string
  }>(),
  type = ref(props.password ? 'password' : 'text'),
  passwordHidden = ref(true),
  passwordIcon = ref('eye'),
  // eslint-disable-next-line no-useless-assignment
  togglePassword = () => {
    passwordHidden.value = !passwordHidden.value
    passwordIcon.value = passwordHidden.value ? 'eye' : 'eye-slash'
    type.value = passwordHidden.value ? 'password' : 'text'
  },
  store = useFormStore(props.storeId),
  // eslint-disable-next-line no-useless-assignment
  isValid = computed(() => store.errors[props.name] ? 'invalid' : 'valid')

store.checks[props.name] = props.checks ?? []
store.inputs[props.name] = props.value ?? ''
</script>

<template>
  <div class="flex flex-col justify-center pb-1 relative">
    <input
      v-model="store.inputs[props.name]"
      class="form-input focusable w-full h-14 p-2 pl-4 placeholder:opacity-0"
      :class="isValid"
      :name
      :title="store.errors[props.name]"
      :autofocus
      :placeholder
      :disabled
      :type
      @input="store.validate"
    >
    <label class="form-input-label">
      {{ placeholder }}
    </label>
    <div class="input-icons">
      <font-awesome-icon
        v-if="password"
        :icon="['fas', passwordIcon]"
        size="xl"
        class="password-toggle"
        @click="togglePassword"
      />
    </div>
  </div>
</template>

<style scoped>
  /* Inputs with placeholders are bigger */
  input[placeholder] {
    @apply pt-6;
  }

  /* Shrink and translate label if:
   * - input is focused
   * - placeholder not shown */
  input:focus + .form-input-label,
  input:not(:placeholder-shown) + .form-input-label {
    transform: translateY(calc(-50%)) scale(.8);
  }

  .password-toggle {
    @apply w-8 text-slate-500 cursor-pointer pointer-events-auto;
  }

  .password-toggle:hover {
    @apply text-slate-400;
  }
</style>
