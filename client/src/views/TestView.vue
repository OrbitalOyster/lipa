<script setup lang="ts">
import { faPoo, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import GooseInput from '#components/GooseInput.vue'
import { ref } from 'vue'

const inputValue = ref('hello')
</script>

<template>
  <h1>Testing grounds</h1>
  <hr>
  <div style="display: flex">
    <GooseButton title="Button 1" />
    <GooseButton :icon="faTruckFast" />
    <GooseButton
      :icon="faPoo"
      title="Button 3"
    />
  </div>
  <GooseInput v-model="inputValue" />
  <GooseInput
    v-model="inputValue"
    placeholder="Type something here"
  />
  <hr>
  <div style="background-color: salmon; display: inline">
    <span>
      Hello!
    </span>
    <span>
      <FontAwesomeIcon
        :icon="faPoo"
      />
    </span>
  </div>
</template>

<style lang="sass" scoped>
  h1
    font-size: 2rem
    font-weight: 600
    margin: 1rem
    text-align: center
</style>
