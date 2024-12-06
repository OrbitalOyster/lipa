<script setup lang="ts">
import type { MyFormCheck } from '@stores/formStore.ts'
import { ref } from 'vue'
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
  store = useFormStore(props.storeId),
  // eslint-disable-next-line no-useless-assignment
  passwordHidden = ref(true)
store.checks[props.name] = props.checks ?? []
store.inputs[props.name] = props.value ?? ''
</script>

<template>
  <div
    class="flex items-center relative"
  >
    <input
      v-model="store.inputs[props.name]"
      class="form-input focusable w-full h-14 px-4 placeholder:opacity-0"
      :class="[
        store.errors[props.name] ? 'invalid' : 'valid',
        disabled && 'form-input-disabled',
        placeholder && 'pt-4'
      ]"
      :name
      :autofocus
      :placeholder
      :disabled
      :type="password && passwordHidden ? 'password' : 'text'"
      @input="store.validate"
    >
    <label class="form-input-label">
      {{ placeholder }}
    </label>
    <div class="input-icons">
      <font-awesome-icon
        v-if="store.errors[props.name]"
        :icon="['fas', 'triangle-exclamation']"
        :title="store.errors[props.name]"
        size="xl"
        class="alert text-rose-400 pointer-events-auto"
      />
      <font-awesome-icon
        v-if="password"
        :icon="['fas', passwordHidden ? 'eye' : 'eye-slash']"
        size="xl"
        class="w-8 text-slate-500 cursor-pointer pointer-events-auto hover:text-slate-400"
        @click="passwordHidden = !passwordHidden"
      />
    </div>
  </div>
</template>
