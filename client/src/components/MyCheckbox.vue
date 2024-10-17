<script setup lang="ts">
defineProps({
  title: { type: String, default: 'INSERT TITLE' },
  formName: { type: String, default: 'INSERT FORM NAME' },
})
// eslint-disable-next-line no-useless-assignment
const checked = defineModel<boolean>()
</script>

<template>
  <label class="container"> {{title}}
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
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1.5rem;
  width: 1.5rem;
  background-color: gray;
  border-radius: .5rem;
}

/* On mouse-over, add a grey background color */
/*
.container:hover input ~ .checkmark {
  background-color: #ccc;
}
*/

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: green;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  /*
  left: 0;
  top: 0;
  width: 1.5rem;
  height: 1.5rem;
  */
  top: 8px;
	left: 8px;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: white;
  /*
  border: solid red;
  border-width: 4px 4px 4px 4px;
  border-radius: 4px;
  */
  /* transform: rotate(45deg); */
}
</style>
