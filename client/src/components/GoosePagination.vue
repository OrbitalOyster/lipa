<script setup lang="ts">

  import GooseButton from '#components/GooseButton.vue'

interface Pagination {
  size: number
  page: number 
  total: number
}

const model = defineModel<Pagination>()

// console.log(Math.floor(model.value.total / model.value.size))

const emit = defineEmits([ 'update' ])

function onClick(i) {
  if (model.value.page !== i - 1) {
    model.value.page = i - 1
    emit('update')
  }
}

</script>

<template>
  <div>
    <span v-for="i in Math.ceil(model.total / model.size)">
      <GooseButton :transparent="model.page !== i - 1" :title="i.toString()" @click="onClick(i)"/>
    </span>
  </div>
</template>

<style lang="sass" scoped>
  div
    align-items: center
    justify-content: space-between
    display: flex
    gap: 1rem
</style>
