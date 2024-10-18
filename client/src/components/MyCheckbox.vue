<script setup lang="ts">
defineProps({
  title: { type: String, default: 'INSERT TITLE' },
  formName: { type: String, default: 'INSERT FORM NAME' },
})
// eslint-disable-next-line no-useless-assignment
const checked = defineModel<boolean>()
</script>

<template>
  <label> {{ title }}
    <input
      v-model="checked"
      type="checkbox"
      :name="formName"
    >
    <span class="checkmark" />
  </label>
</template>

<style scoped>

label {
  @apply relative pl-8 select-none cursor-pointer;
}

.checkmark {
  /* Border */
  @apply border border-slate-300 rounded;
  /* Sizing */
  @apply absolute inset-0 w-6 h-6;
  /* Colors */
  @apply bg-slate-50;
}

.checkmark:after {
  @apply absolute hidden content-none;
  content: "";

  @apply inset-1.5 w-3 h-3 rounded bg-white;
}

/* Actual checkbox */
input {
  @apply absolute opacity-0 w-0 h-0;
}

/* On focus */
input:focus ~ .checkmark {
  @apply ring-2 ring-offset-2 ring-emerald-400;
}

/* On active */
label input:active ~ .checkmark {
  @apply bg-emerald-700 border-0;
}

/* On checked - box */
input:checked ~ .checkmark {
  @apply bg-emerald-500 border-0;
}

/* On checked - mark */
input:checked ~ .checkmark:after {
  display: block;
}

</style>
