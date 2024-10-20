<script setup lang="ts">
  import InputText from '../components/InputText.vue'  
  import MyButton from '../components/MyButton.vue'  
  import MyForm from '../components/MyForm.vue'  
</script>

<template>
  <div class="flex w-screen h-screen items-center justify-center">
    <div class="border bg-sky-100 w-1/2 h-1/2 p-3">
      <MyForm class="space-y-2">
        <InputText name="sampleInput1" required/>
        <InputText name="sampleInput2" required/>
        <MyButton title="Готово" submit/>
      </MyForm>
    </div>
  </div>
</template>
