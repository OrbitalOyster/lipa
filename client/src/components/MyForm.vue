<script setup lang="ts">
const onSubmit = (e) => {
  e.stopPropagation()
  e.target.classList.add('validated')
  console.log("Form submit")
  const formData = new FormData(e.target)
  const formProps = Object.fromEntries(formData)
  console.log({formData, formProps})
  console.log(formData.getAll('sampleInput'))
}
</script>

<template>
  <form @submit.prevent="onSubmit" novalidate>
    <h1>Form</h1>   
    <slot class="validated"></slot>
  </form>
</template>
