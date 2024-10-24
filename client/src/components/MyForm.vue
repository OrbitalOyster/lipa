<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type InputText from './InputText.vue'

import { useFormStore } from '../stores/formStore.ts'

const emits = defineEmits(['submit'])

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
})

const store = useFormStore(props.id)

const form: Ref<HTMLFormElement | null> = ref(null),
  /* All custom inputs */
  getInputs = (): NodeListOf<HTMLInputElement> => {
    if (!form.value) {
      throw new Error('Major screwup')
    }
    return form.value.querySelectorAll('[data-lipa]')
  },
  // eslint-disable-next-line no-useless-assignment
  reset = () => {
    if (!form.value) {
      throw new Error('Major screwup')
    }
    form.value.reset()
    getInputs().forEach((e) => {
      e.classList.remove('validated')
    })
  },
  // eslint-disable-next-line no-useless-assignment
  onSubmit = () => {
    if (Object.values(store.myChecks).every(Boolean)) {
      console.log("Form validation success")
      emits('submit', store.myInputs)
    }
    else
      console.log("Form validation failed")

//    getInputs().forEach((e) => {
//      e.setCustomValidity('')
//      e.classList.add('validated')
//      /* Check for required */
//      if (e.required && !e.value) {
//        e.setCustomValidity('Enter something')
//        e.dispatchEvent(new CustomEvent('form-error', {detail: 'Enter something'}))
//      }
//      /* Check for foo */
//      if (e.dataset.foo === 'hello' && e.value !== 'hello') {
//        e.setCustomValidity('Foo!')
//      }
//    })
    // store.$dispose()
  }

</script>

<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <h1>Form</h1>
    <slot />
    <button
      type="button"
      @click="reset"
    >
      Сброс
    </button>
  </form>
</template>
