<script setup lang="ts">
  defineProps({
    title: String, 
    'form-id': String,
    'form-name': String,
  }); 
  const checked = defineModel<boolean>()
</script>

<template>
  <span class="flex items-center">
    <input class="w-5 h-5 mr-2" type="checkbox" :id="formId" :name="formName" v-model="checked" />
    <span>
      <label :for="formId">{{title}}</label>
    </span>
  </span>
</template>

<style scoped>
  input {
    
  }
</style>
