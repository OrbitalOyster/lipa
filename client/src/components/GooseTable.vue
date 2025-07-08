<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'

import { ref, useSlots } from 'vue'

interface TableModel {
  headers: string[]
  rows: string[][]
}

const props = defineProps<{
  loading: boolean
}>()

const slots = useSlots(),
  slotNames = Object.keys(slots),
  model = defineModel<TableModel>({ required: true })

</script>

<template>
  <table :class="{ loading }">
    <thead>
      <tr>
        <th
          v-for="header, i in model.headers"
          :key="i"
        >
          <div>
            <span
              class="header"
              :class="header.sortable && 'sortable'"
            >
              {{ header.title }}
            </span>
            <FontAwesomeIcon
              v-if="header.sortable"
              :icon="faArrowDownWideShort"
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
    width: 100%
    transition: filter .2s ease-in-out

  .loading
    pointer-events: none
    filter: blur(8px)

  th
    height: 2rem

  .header
    font-weight: 600

  .sortable
    color: colors.$primary
    text-decoration: underline
    text-decoration-style: dotted
    /* text-decoration-thickness: .0625rem */
    text-decoration-color: colors.$primary
    text-underline-offset: .25rem
    cursor: pointer
    user-select: none

  tbody tr
    border-top: 1px solid #F0F0F0
    border-bottom: 1px solid #F0F0F0
    cursor: pointer

  tbody tr:hover
    background-color: #ABEBC6

  td
    height: 3rem

  td div, th div
    display: flex
    justify-content: center
    height: 100%
    align-items: center

  tr:nth-child(even)
    background-color:  #E8F8F5
  </style>
