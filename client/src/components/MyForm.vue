<script setup lang="ts">
const onSubmit = (e) => {
  e.stopPropagation()
  console.log("Form submit")
  const formData = new FormData(e.target)
  const formProps = Object.fromEntries(formData)
  console.log(formData, formProps)
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <h1>Form</h1>   
    <slot></slot>
  </form>
</template>
