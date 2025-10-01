<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import GooseInput from '#components/GooseInput.vue'
import { faPoo } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'

const inputValue = ref('hello')
</script>

<template>
  <h1>Testing grounds</h1>
  <hr>
  <GooseButton title="Button 1" />
  <GooseButton :icon="faPoo" />
  <GooseButton
    :icon="faPoo"
    title="Button 3"
  />
  <GooseInput v-model="inputValue" />
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
