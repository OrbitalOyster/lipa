<script setup lang="ts">
import { faPoo, faTruckFast, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import GooseInput from '#components/GooseInput.vue'
import GooseSelect from '#components/GooseSelect.vue'
import { ref } from 'vue'

const inputValue = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')

const testSelectItems = ref([
  { id: 1, title: 'Lorem ipsum' },
  { id: 2, title: 'dolor sit amet' },
  { id: 3, title: 'consectetur adipiscing elit' },
])
const testSelect = ref('')

</script>

<template>
  <h1>Testing grounds</h1>
  <hr>
  <div>
    <GooseButton title="Button 1" />
    <div style="display: flex; padding: 1rem; align-items: center">
      <GooseButton
        :icon="faTruckFast"
        round
      />
      <FontAwesomeIcon
        :icon="faTruckFast"
        size="2xl"
      />
      <button>
        Hello!
      </button>
    </div>
    <GooseButton
      :icon="faPoo"
      title="Button 3"
    />
  </div>
  <div style="display: flex">
    <GooseInput
      v-model="inputValue"
      placeholder="Type something here"
    />
    <GooseInput v-model="inputValue" />
    <GooseSelect
      v-model="testSelect"
      :items="testSelectItems"
      placeholder="Select something"
      style="width: 20rem"
    />
  </div>
  <GooseInput
    v-model="inputValue"
    placeholder="Type something here"
    password
  />
  <hr>

  <div style="display: flex; align-items: center; justify-content: center; background-color: black; height: 35rem">
    <div style="background-color: gray; width: 25rem; height: 25rem">
      <h1>Hello</h1>
    </div>
  </div>
</template>

<style lang="sass" scoped>
  h1
    font-size: 2rem
    font-weight: 600
    margin: 1rem
    text-align: center
</style>
