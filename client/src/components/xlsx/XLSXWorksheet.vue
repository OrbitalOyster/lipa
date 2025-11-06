<script setup lang="ts">
import { ValueType } from 'exceljs'

interface XLSXCell {
  address: string
  type: ValueType
  value: any
}

interface XLSXWorksheet {
  name: string
  rowHeights: number[]
  colWidths: number[]
  merges: string[]
  rows: XLSXCell[][]
}
const model = defineModel<XLSXWorksheet>()

const getCell = (r: number, c: number) => {
  const row = model.value?.rows[r]
  if (!row)
    return null
  const cell = row[c]
  if (!cell?.value)
    return null

  return cell
}

const getCellValue = (r: number, c: number) => {
  const cell = getCell(r, c)
  if (!cell)
    return ''
  return cell.value
}

const getCellStyle = (r: number, c: number) => {
  const WIDTH_M = 1 / 2.2 * 16,
    HEIGHT_M = 1 / 12 * 16

  const cell = getCell(r, c),
    style = {
      backgroundColor: 'white',
      width: (model.value?.colWidths[c] * WIDTH_M) + 'px',
      height: (model.value?.rowHeights[r] * HEIGHT_M) + 'px',
    }
  return style
}

</script>

<template>
  <div>
    <table>
      <tbody>
        <!-- TODO: Stoopid -->
        <tr
          v-for="row in model?.rowHeights.length"
          :key="row"
        >
          <!-- TODO: More stoopid -->
          <td
            v-for="col in model?.colWidths.length"
            :key="col"
            :style="getCellStyle(row - 1, col - 1)"
          >
            {{ getCellValue(row - 1, col - 1) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="sass" scoped>

td
  border: 1px solid #DDD

</style>
