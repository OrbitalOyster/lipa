<script setup lang="ts">
import useFetchReports from '#composables/useFetchReports.ts'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'

import { ref, useSlots } from 'vue'

interface TableModel {
  headers: string[]
  rows: string[][]
}

const slots = useSlots(),
  slotNames = Object.keys(slots)

const model = defineModel<TableModel>({ required: true }),
  headers = model.value.headers,
  rows = model.value.rows

const reports = await useFetchReports(10, 1)
console.log(reports)

</script>

<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="header, i in headers"
          :key="i"
        >
          <div class="cell">
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
      <tr v-for="row in rows">
        <td v-for="cell, c in row">
          <div class="cell">
            <slot
              v-if="slotNames.includes(c)"
              :name="c"
              v-bind="{td: cell}"
            />
            <span v-else>{{ cell }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'

  table
    width: 100%

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

  tr:nth-child(even)
    background-color:  #E8F8F5

  /* td */
    /* padding: 1rem */

  .cell
    display: flex
    justify-content: center
    height: 100%
    align-items: center
  </style>
