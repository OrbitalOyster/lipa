<script setup lang="ts">

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import GooseButton from '#components/GooseButton.vue'
import { computed, ref, watch } from 'vue'

const firstPages = 3,
  middlePages = 3,
  lastPages = 3

interface Pagination {
  size: number
  page: number 
  total: number
}

const model = defineModel<Pagination>(),
  emit = defineEmits([ 'update' ])

function isPageVisible(n, active, total) {
  /* First and last pages */
  if (n < firstPages || n >= total - lastPages)
    return true

  /* Pages around active */
  if (n >= active - 1 && n <= active + 1)
    return true

  /* Pages around middle section */
  const m = Math.round(total / 2)
  if (n + 1 >= m - 1 && n + 1 <= m + 1)
    return true
  
  return false
}

const totalPages = computed(() => Math.ceil(model.value.total / model.value.size)) 

function setPage(i) {
  if (model.value.page !== i) {
    model.value.page = i

    if (model.value.page < 0)
      model.value.page = 0

    if (model.value.page >= totalPages.value )
      model.value.page = totalPages.value - 1

    emit('update')
  }
}
</script>

<template>
  <div>

    <FontAwesomeIcon
      class="arrow"
      :icon="faChevronLeft"
      @click="setPage(model.page - 1)"
      size="lg"
    />

    <template v-for="i in totalPages">
      <span
        class="page"
        :class="{ active: i - 1 === model.page }"
        v-if="isPageVisible(i - 1, model.page, totalPages)"
        @click="setPage(i - 1)"
      >
      {{ i }} 
      </span>
      <template v-else>.</template>
    </template>

    <FontAwesomeIcon
      class="arrow"
      :icon="faChevronRight"
      @click="setPage(model.page + 1)"
      size="lg"
    />

  </div>
</template>

<style lang="sass" scoped>
  div
    align-items: center
    justify-content: space-between
    display: flex
    gap: 1rem

  .arrow
    cursor: pointer
    user-select: none

  span.page
    cursor: pointer
    font-size: 1.5rem
    user-select: none

  span.page.active
    font-size: 1.5rem
    font-weight: bold

</style>
