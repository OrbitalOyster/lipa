<script setup lang="ts">
import { faArrowDownShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import { useSlots } from 'vue'

defineProps<{
  loading: boolean
}>()

const slots = useSlots(),
  slotNames = Object.keys(slots),
  model = defineModel<TableModel>({ required: true })

const emit = defineEmits<{ update: [] }>()

const sort = (column: string) => {
  if (model.value.sortBy === column)
    model.value.desc = !model.value.desc
  else
    model.value.sortBy = column
  emit('update')
}
</script>

<template>
  <table :class="{ loading }">
    <thead>
      <tr>
        <th>
          <div>
            <GooseCheckbox />
          </div>
        </th>
        <th
          v-for="header, i in model.headers"
          :key="i"
        >
          <div>
            <span
              class="header"
              :class="header.sortable && 'sortable'"
              @click="header.sortable && sort(header.prop)"
            >
              {{ header.title }}
            </span>
            <FontAwesomeIcon
              v-if="model.sortBy === header.prop"
              :icon="model.desc ? faArrowDownWideShort : faArrowDownShortWide"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row, r in model.rows"
        :key="r"
      >
        <td>
          <div>
            <GooseCheckbox />
          </div>
        </td>
        <td
          v-for="header, h in model.headers"
          :key="h"
        >
          <div>
            <slot
              v-if="slotNames.includes(header.prop)"
              :name="header.prop"
              v-bind="{td: row[header.prop]}"
            />
            <span v-else>{{ row[header.prop] }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'

  table
    filter: blur(0px)
    transition: filter .1s ease-in-out
    width: 100%

  .loading
    pointer-events: none
    filter: blur(8px)

  thead
    height: 3.5rem

  thead tr
    background-color: tomato
    position: sticky
    top: 0
    z-index: 10

  th
    height: 100%
    vertical-align: middle

  .header
    font-weight: 600

  .sortable
    color: colors.$primary
    cursor: pointer
    text-decoration-color: colors.$primary
    text-decoration-style: dotted
    text-decoration: underline
    text-underline-offset: .25rem
    user-select: none

  tbody tr
    border-bottom: 1px solid #F0F0F0
    border-top: 1px solid #F0F0F0
    cursor: pointer

  tbody tr:hover
    background-color: #ABEBC6

  td
    height: 3rem
    vertical-align: middle

  td div, th div
    align-items: center
    display: flex
    height: 100%
    justify-content: center

  th:first-child, td:first-child
    width: 4rem /* TODO: No magic numbers */

  tr:nth-child(even)
    background-color:  #E8F8F5
  </style>
