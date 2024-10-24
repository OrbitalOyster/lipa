<script setup lang="ts">
import { ref } from 'vue'

import InputText from '../components/InputText.vue'
import MyButton from '../components/MyButton.vue'
import MyForm from '../components/MyForm.vue'

</script>

<template>
  <div class="flex w-screen h-screen items-center justify-center">

    <div class="border bg-sky-100 w-1/2 h-1/2 p-3">
      <MyForm class="space-y-2" id="mySampleForm" @submit="e => console.log('YAY', e)">
        <InputText
          name="sampleInput1"
          store="mySampleForm"
          required
        />
        <InputText
          name="sampleInput2"
          store="mySampleForm"
          placeholder="Бугага"
          required
        />
        <InputText
          name="sampleInput3"
          store="mySampleForm"
          foo="hello"
        />
        <MyButton
          title="Готово"
          submit
        />
      </MyForm>
    </div>

<!--
    <div class="border bg-zinc-100 w-1/2 h-1/2 p-3">
      <form class="space-y-2" novalidate>
        <InputText
          name="sampleInput1"
          v-model="sampleInput1"
          required
        />
        <InputText
          name="sampleInput2"
          placeholder="Бугага"
          required
        />
        <InputText
          name="sampleInput3"
          foo="hello"
        />
        <MyButton
          title="Готово"
          submit
        />
      </form>
    </div>
-->
    <RouterLink to="/">
      Back
    </RouterLink>

  </div>
</template>
