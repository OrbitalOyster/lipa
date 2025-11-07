<script setup lang="ts">
import type { CellValue } from 'exceljs'
import { ValueType } from 'exceljs'

interface XLSXCell {
  address: string
  type: ValueType
  value: CellValue
  rowSpan: number
  colSpan: number
}

interface XLSXWorksheet {
  name: string
  width: number
  height: number
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
  if (!cell)
    return null

  return cell
}

const isMergedCell = (r: number, c: number) => {
  const cell = getCell(r, c)
  return cell?.type === ValueType.Merge
}

const getCellValue = (r: number, c: number) => {
  const cell = getCell(r, c)
  if (!cell)
    return ''
  if (cell.type === ValueType.Formula)
    return 'Σ'
  return cell.value
}

const getCellStyle = (r: number, c: number) => {
  const WIDTH_M = 1 / 2.2 * 16,
    HEIGHT_M = 1 / 12 * 16,
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
        <tr
          v-for="row in model?.height"
          :key="row"
        >
          <template
            v-for="col in model?.width"
            :key="col"
          >
            <td
              v-if="!isMergedCell(row - 1, col - 1)"
              :style="getCellStyle(row - 1, col - 1)"
              :rowSpan="getCell(row - 1, col - 1)?.rowSpan"
              :colSpan="getCell(row - 1, col - 1)?.colSpan"
            >
              {{ getCellValue(row - 1, col - 1) }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="sass" scoped>

td
  border: 1px solid #DDD

</style>
