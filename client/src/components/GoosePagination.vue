<script setup lang="ts">

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import GooseButton from '#components/GooseButton.vue'
import { computed, ref, watch } from 'vue'

interface Pagination {
  size: number
  page: number 
  total: number
}

const props = defineProps<{
  firstPages: number 
  middlePages: number
  lastPages: number
  disabled: boolean
}>(),
  model = defineModel<Pagination>(),
  emit = defineEmits([ 'update' ]),
  totalPages = computed(() => Math.ceil(model.value.total / model.value.size))

function isPageVisible(n, active, total) {
  /* First and last pages */
  if (n < props.firstPages || n >= total - props.lastPages)
    return true

  /* Pages around active */
  if (n >= active - 1 && n <= active + 1)
    return true

  /* Pages around middle section */
  const m = Math.round(total / 2)
  if (n + 1 >= m - props.middlePages && n + 1 <= m + props.middlePages)
    return true
  
  return false
}


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
  <ul :class="{ disabled }">

    <FontAwesomeIcon
      class="arrow"
      :icon="faChevronLeft"
      @click="setPage(model.page - 1)"
      size="lg"
    />

    <template v-for="i in totalPages">
      <li
        class="page"
        :class="{ active: i - 1 === model.page }"
        v-if="isPageVisible(i - 1, model.page, totalPages)"
        @click="setPage(i - 1)"
      >
      {{ i }} 
      </li>
      <template v-else-if="isPageVisible(i - 2, model.page, totalPages)">
        <FontAwesomeIcon
          :icon="faEllipsis"
          size="lg"
        />
      </template>
    </template>

    <FontAwesomeIcon
      class="arrow"
      :icon="faChevronRight"
      @click="setPage(model.page + 1)"
      size="lg"
    />

  </ul>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'

  ul
    align-items: center
    justify-content: center
    display: flex
    gap: .1rem

  ul.disabled
    pointer-events: none 
    filter: grayscale(1)

  .arrow
    cursor: pointer
    user-select: none
    width: 2rem

  li.page
    display: flex
    justify-content: center
    align-items: center
    box-sizing: border-box
    cursor: pointer
    font-size: 1.25rem
    user-select: none
    border-radius: .5rem
    min-width: 2.5rem
    min-height: 2.5rem

  li.page.active
    color: white
    background-color: colors.$primary
</style>
