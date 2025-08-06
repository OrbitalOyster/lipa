<script setup lang="ts">

import { faChevronLeft, faChevronRight, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from 'vue'

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
  model = defineModel<Pagination>({ required: true }),
  emit = defineEmits(['update']),
  totalPages = computed(() => Math.ceil(model.value.total / model.value.size))

function isPageVisible(n: number, active: number, total: number) {
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

function setPage(i: number) {
  if (model.value.page !== i) {
    model.value.page = i

    if (model.value.page < 0)
      model.value.page = 0

    if (model.value.page >= totalPages.value)
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
      size="lg"
      @click="setPage(model.page - 1)"
    />

    <template
      v-for="i in totalPages"
      :key="i"
    >
      <li
        v-if="isPageVisible(i - 1, model.page, totalPages)"
        class="page"
        :class="{ active: i - 1 === model.page }"
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
      size="lg"
      @click="setPage(model.page + 1)"
    />
  </ul>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'

  ul
    align-items: center
    display: flex
    gap: .1rem
    justify-content: center

  ul.disabled
    filter: grayscale(1)
    pointer-events: none

  .arrow
    cursor: pointer
    user-select: none
    width: 2rem

  li.page
    align-items: center
    border-radius: .5rem
    box-sizing: border-box
    cursor: pointer
    display: flex
    font-size: 1.25rem
    justify-content: center
    min-height: 2.5rem
    min-width: 2.5rem
    user-select: none

  li.page.active
    color: colors.$button
    background-color: colors.$primary
</style>
