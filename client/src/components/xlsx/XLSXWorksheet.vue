<script setup lang="ts">
import type { CellValue } from 'exceljs'
import { ValueType } from 'exceljs'

type Border = 'hair' | 'thin' | 'medium' | 'thick' | 'dotted'

interface XLSXCell {
  address: string
  type: ValueType
  value: CellValue
  rowSpan: number
  colSpan: number
  borders?: {
    top?: Border
    right?: Border
    bottom?: Border
    left?: Border
  }
  font?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
  backgroundColor: string
  textAlign: 'center' | 'left' | 'right'
  verticalAlign: 'middle' | 'top' | 'bottom'
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
    // BORDER_DEFAULT = '1px solid #DDD',
    BORDER_DEFAULT = 'none',
    BORDER_MAP = {
      hair: '1px solid darkslategray',
      thin: '1px solid darkslategray',
      medium: '2px solid darkslategray',
      thick: '2px solid darkslategray',
      dotted: '2px dotted darkslategray',
      default: BORDER_DEFAULT,
    },
    width = (model.value?.colWidths[c] ?? 0) * WIDTH_M,
    height = (model.value?.rowHeights[r] ?? 0) * HEIGHT_M,
    cell = getCell(r, c),
    borderTop = BORDER_MAP[cell?.borders?.top ?? 'default'],
    borderRight = BORDER_MAP[cell?.borders?.right ?? 'default'],
    borderBottom = BORDER_MAP[cell?.borders?.bottom ?? 'default'],
    borderLeft = BORDER_MAP[cell?.borders?.left ?? 'default'],
    fontWeight = cell?.font?.bold ? 'bold' : 'normal',
    fontStyle = cell?.font?.italic ? 'italic' : 'normal',
    textDecoration = cell?.font?.underline ? 'underline' : 'none',
    backgroundColor = cell?.backgroundColor ?? 'white',
    textAlign = cell?.textAlign,
    verticalAlign = cell?.verticalAlign,
    style = {
      backgroundColor,
      textAlign,
      verticalAlign,
      width: width + 'px',
      height: height + 'px',
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      fontWeight,
      fontStyle,
      textDecoration,
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
</style>
