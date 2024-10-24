<script setup lang="ts">

import InputText from '../components/InputText.vue'
import MyButton from '../components/MyButton.vue'
import MyForm from '../components/MyForm.vue'

</script>

<template>
  <div class="flex w-screen h-screen items-center justify-center">

    <div class="border bg-sky-100 w-1/2 h-1/2 p-3">
      <MyForm class="space-y-2" id="mySampleForm" @submit="e => console.log('YAY', e)">
        <InputText
          name="from"
          store-id="mySampleForm"
          placeholder="From"
          :checks="['required', 'lessThanTo']"
        />
        <InputText
          name="to"
          store-id="mySampleForm"
          placeholder="To"
          :checks="['required', 'moreThanFrom']"
        />
        <InputText
          name="sampleInput2"
          store-id="mySampleForm"
          placeholder="Бугага"
          :checks="['required']"
        />
        <InputText
          name="sampleInput3"
          store-id="mySampleForm"
        />
        <MyButton
          title="Готово"
          submit
        />
      </MyForm>

      <RouterLink to="/">
        Back
      </RouterLink>
    </div>

  </div>
</template>
