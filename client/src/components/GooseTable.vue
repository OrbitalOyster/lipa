<script setup lang="ts">
import useFetchReports from '#composables/useFetchReports.ts'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'

import { ref } from 'vue'
import { useSlots } from 'vue'

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

const items = ref([
/*
  {date: 123, n: {td: 1}, str: {td:"hello"}, n2: 100 },
  {date: 123, n: {td: 2}, str: {td:"world"}, n2: 100 },
  {date: 123, n: {td: 3}, str: {td:"foo"}, n2: 100 },
  {date: 123, n: {td: 4}, str: {td:"bar"}, n2: 100 },
  {date: 123, n: {td: 5}, str: {td:"baz"}, n2: 100 },
*/
  {date: 123, n: 1, str: "hello", n2: 100 },
  {date: 123, n: 2, str: "world", n2: 100 },
  {date: 123, n: 3, str: "foo", n2: 100 },
  {date: 123, n: 4, str: "bar", n2: 100 },
  {date: 123, n: 5, str: "baz", n2: 100 },
])

</script>

<template>

  <table>
    <thead>
    </thead>
    <tbody>
      <tr v-for="row, r in items">
        <td v-for="cell, c in row">
          <slot v-if="slotNames.includes(c)" :name="c" v-bind="{td: cell}"/>
          <p v-else>{{cell}}</p>
        </td>
      </tr>
    </tbody>
  </table>

<!--
  <table>
    <thead>
      <tr>
        <th 
          v-for="header, i in headers"
          key="i"
        >
          <div class="foo">
            <span 
              :class="i < 2 && 'sortable'"
            >
              {{ header }}
            </span>
            <FontAwesomeIcon
              :icon="faArrowDownWideShort"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows">
        <td v-for="item in row">
          <div class="foo">
            {{ item }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
-->

</template>

<style lang="sass" scoped>
  @use '../assets/colors'

  table
    width: 100%

  th
    height: 2rem

  th div
    font-size: 1rem
    /* padding: .5rem */
    display: flex
    justify-content: center
    gap: .2rem

  .sortable
    color: colors.$primary
    text-decoration: underline
    text-decoration-style: dotted
    /* text-decoration-thickness: .0625rem */
    text-decoration-color: colors.$primary
    text-underline-offset: .25rem
    cursor: pointer
    user-select: none

  tr
    border-top: 1px solid #F0F0F0
    border-bottom: 1px solid #F0F0F0

  td
    height: 3rem

  tr:nth-child(even)
    background-color:  #E8F8F5

  /* td */
    /* padding: 1rem */

  .foo
    display: flex
    justify-content: center
    height: 100%
    align-items: center
  </style>
