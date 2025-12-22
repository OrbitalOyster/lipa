<script setup lang="ts">
import { faChevronLeft, faChevronRight, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from 'vue'

const props = defineProps<{
    size: number
    total: number
    firstPages: number
    middlePages: number
    lastPages: number
    disabled: boolean
  }>(),
  model = defineModel<number>({ required: true }),
  emit = defineEmits(['update']),
  totalPages = computed(() => Math.ceil(props.total / props.size))

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
  /* Rest of them */
  return false
}

function setPage(i: number) {
  /* If we're actually changing pages */
  if (model.value !== i) {
    model.value = i
    /* Not going over */
    if (model.value >= totalPages.value)
      model.value = totalPages.value - 1
    /* Not going under */
    if (model.value < 0)
      model.value = 0
    emit('update')
  }
}
</script>

<template>
  <ul :class="{ disabled }">
    <!-- Arrow left -->
    <FontAwesomeIcon
      v-if="totalPages > 1"
      class="arrow"
      :icon="faChevronLeft"
      size="lg"
      @click="model && setPage(model - 1)"
    />
    <!-- Pages -->
    <template
      v-for="i in totalPages"
      :key="i"
    >
      <li
        v-if="isPageVisible(i - 1, model, totalPages)"
        class="page"
        :class="{ active: i - 1 === model }"
        @click="setPage(i - 1)"
      >
        {{ i }}
      </li>
      <FontAwesomeIcon
        v-else-if="isPageVisible(i - 2, model, totalPages)"
        :icon="faEllipsis"
        size="lg"
      />
    </template>
    <!-- Arrow right -->
    <FontAwesomeIcon
      v-if="totalPages > 1"
      class="arrow"
      :icon="faChevronRight"
      size="lg"
      @click="(model !== totalPages - 1) && setPage(model + 1)"
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
    color: colors.$button-title
    background-color: colors.$primary
</style>
