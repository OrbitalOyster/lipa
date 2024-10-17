<script setup lang="ts">
defineProps({
  title: { type: String, default: 'INSERT TITLE' },
  formName: { type: String, default: 'INSERT FORM NAME' },
})
// eslint-disable-next-line no-useless-assignment
const checked = defineModel<boolean>()
</script>

<template>
  <label> {{title}}
    <input
      v-model="checked"
      type="checkbox"
      :name="formName"
    >
    <span class="checkmark">
    </span>
  </label>
</template>

<style scoped>

 /* Customize the label (the container) */
label {
  @apply relative pl-10 select-none cursor-pointer;
}

/* Hide the browser's default checkbox */
input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  /* Border */
  @apply border border-slate-300 rounded;
  /* Sizing */
  @apply absolute inset-0 w-6 h-6;
  /* Colors */
  @apply bg-slate-50;
}

/* When the checkbox is checked, add a blue background */
input:checked ~ .checkmark {
  @apply bg-emerald-500 border-0;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
input:checked ~ .checkmark:after {
  display: block;
}

input:focus ~ .checkmark {
  @apply ring-offset-2 ring-2 ring-emerald-400;
}

/* Style the checkmark/indicator */
label .checkmark:after {
  @apply inset-1.5 w-3 h-3;
	border-radius: 50%;
	background: white;
}
</style>
