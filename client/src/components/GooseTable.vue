<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, useSlots } from 'vue'
import { faArrowDownShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseCheckbox from '#components/GooseCheckbox.vue'

defineProps<{
  updating: boolean
}>()

const slots = useSlots(),
  slotNames = Object.keys(slots),
  model = defineModel<TableModel<T>>({ required: true }),
  emit = defineEmits<{ update: [] }>(),
  sort = (column: string) => {
    if (model.value.sortBy === column)
      model.value.desc = !model.value.desc
    else
      model.value.sortBy = column
    emit('update')
  }

const selectAllRef = computed({
    get() {
      return model.value.rows.some(l => l.selected)
    },
    set(newValue) {
      for (const row of model.value.rows)
        row.selected = newValue
    },
  }),
  selectAllIndetermitate = computed(
    () => {
      /* Empty table */
      if (!model.value.rows[0])
        return false
      const first = model.value.rows[0]
      return model.value.rows.some(l => l.selected !== first.selected)
    },
  )

</script>

<template>
  <table :class="{ updating }">
    <thead>
      <tr>
        <th>
          <div>
            <GooseCheckbox
              v-model="selectAllRef"
              :indeterminate="selectAllIndetermitate"
            />
          </div>
        </th>
        <th
          v-for="header, i in model.headers"
          :key="i"
        >
          <div>
            <div
              class="header"
              :class="header.sortable && 'sortable'"
              @click="header.sortable && sort(header.prop)"
            >
              {{ header.title }}
            </div>
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
            <GooseCheckbox v-model="row.selected" />
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
              v-bind="{ td: row.data[header.prop] }"
            />
            <div v-else>
              {{ row.data[header.prop] }}
            </div>
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

  .updating
    pointer-events: none
    filter: blur(8px)

  thead
    height: 3.5rem

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
