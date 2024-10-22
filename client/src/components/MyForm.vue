<script setup lang="ts">
import { Ref, ref } from 'vue'

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
    getInputs().forEach((e) => {
      e.setCustomValidity('')
      e.classList.add('validated')
      /* Check for required */
      if (e.required && !e.value) {
        e.setCustomValidity('Enter something')
      }
      /* Check for foo */
      if (e.dataset.foo === 'hello' && e.value !== 'hello') {
        e.setCustomValidity('Foo!')
      }
    })
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
