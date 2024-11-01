<script setup lang="ts">

import InputText from '../components/InputText.vue'
import MyButton from '../components/MyButton.vue'
import MyForm from '../components/MyForm.vue'
import MySelect from '../components/MySelect.vue'

// eslint-disable-next-line no-useless-assignment
const options = [
  '1 Macao',
  '2 Madagascar',
  '3 Malawi',
  '4 Malaysia',
  '5 Maldives',
  '6 Mali',
  '7 Malta',
  '8 Marshall Islands (the)',
  '9 Martinique',
  '10 Mauritania',
  '11 Mauritius',
  '12 Mayotte',
  '13 Mexico',
  '14 Micronesia (Federated States of)',
  '15 Moldova (the Republic of)',
  '16 Monaco',
  '17 Mongolia',
  '18 Montenegro',
  '19 Montserrat',
  '20 Morocco',
]

</script>

<template>
  <div class="flex w-screen h-screen items-center justify-center">
    <div class="border bg-sky-100 w-1/2 h-1/2 p-3">
      <MyForm
        id="mySampleForm"
        class="space-y-2"
        @submit="e => console.log('YAY', e)"
      >
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
          :checks="['required']"
        />
        <InputText
          name="sampleInput3"
          store-id="mySampleForm"
        />

        <MySelect
          name="selectInput1"
          store-id="mySampleForm"
          placeholder="Select something"
          :checks="['required']"
          :options
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
