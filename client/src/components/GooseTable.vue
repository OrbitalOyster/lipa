<script setup lang="ts">
  interface TableRow {
    items: string[] 
  }
  interface TableModel {
    headers: string[]
    rows: TableRow[]
  }
  const model = defineModel<TableModel>()
  
</script>

<template>
  <table>
    <thead />
      <th v-for="header in model.headers">
        {{ header }}
      </th>
    <tbody>
      <tr v-for="row in model.rows">
        <td v-for="item in row">
          <div>
            {{ item }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="sass" scoped>
  table
    width: 100%

  tr
    height: 3rem
    border-top: 1px solid #F0F0F0
    border-bottom: 1px solid #F0F0F0

  tr:nth-child(even)
    background-color:  #E8F8F5 

  td
    padding: 1rem

  div
    display: flex
    justify-content: center
  </style>
