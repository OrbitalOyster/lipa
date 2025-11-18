<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import type { CellValue } from 'exceljs'
import GooseInput from '#components/GooseInput.vue'
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
    color?: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
  backgroundColor: string
  textAlign: 'center' | 'left' | 'right'
  verticalAlign: 'middle' | 'top' | 'bottom'
}

interface Editable {
  alias: string[]
  address: string
}

interface XLSXWorksheet {
  name: string
  width: number
  height: number
  rowHeights: number[]
  colWidths: number[]
  merges: string[]
  rows: XLSXCell[][]
  tables: {
    name: string
    rowNum: number
    colNum: number
  }
  editables: Editable[]
}
const model = defineModel<XLSXWorksheet>(),
  activeCell = ref<null | string>(null),
  activeRow = ref<null | number>(null),
  activeCol = ref<null | number>(null),
  editable = ref('foo'),
  editableInput = useTemplateRef('editableInput')

const data = ref({
  '1 3': 100,
  '3.1 4': 200,
})

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

const isEditableCell = (r: number, c: number) => {
  const cell = getCell(r, c),
    address = cell?.address
  return model.value?.editables.find(e => e.address === address)
}

const activateCell = async (r: number, c: number) => {
  if (!editableInput.value)
    throw new Error('Majow screwup')
  if (!isEditableCell(r, c))
    return
  activeCell.value = '#' + getCell(r, c)?.address
  await nextTick()
  editableInput.value.focus()
  editableInput.value.selectAll()

  activeRow.value = r
  activeCol.value = c
}

const deactivateCell = () => {
  if (!editableInput.value)
    throw new Error('Majow screwup')
  editableInput.value.blur()
  activeCell.value = null
  activeRow.value = null
  activeCol.value = null
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
    width = (model.value?.colWidths[c] ?? 0) * WIDTH_M + 'px',
    height = (model.value?.rowHeights[r] ?? 0) * HEIGHT_M + 'px',
    cell = getCell(r, c),
    borderTop = BORDER_MAP[cell?.borders?.top ?? 'default'],
    borderRight = BORDER_MAP[cell?.borders?.right ?? 'default'],
    borderBottom = BORDER_MAP[cell?.borders?.bottom ?? 'default'],
    borderLeft = BORDER_MAP[cell?.borders?.left ?? 'default'],
    fontWeight = cell?.font?.bold ? 'bold' : 'normal',
    fontStyle = cell?.font?.italic ? 'italic' : 'normal',
    textDecoration = cell?.font?.underline ? 'underline' : 'none',
    backgroundColor = cell?.backgroundColor,
    color = cell?.font?.color,
    textAlign = cell?.textAlign ?? 'left',
    verticalAlign = cell?.verticalAlign ?? 'bottom',
    style = {
      backgroundColor,
      color,
      textAlign,
      verticalAlign,
      width,
      height,
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
              :id="getCell(row - 1, col - 1)?.address"
              :class="[isEditableCell(row - 1, col - 1) && 'editable']"
              :style="getCellStyle(row - 1, col - 1)"
              :rowSpan="getCell(row - 1, col - 1)?.rowSpan"
              :colSpan="getCell(row - 1, col - 1)?.colSpan"
              @mousedown.prevent
              @click="activateCell(row - 1, col - 1)"
            >
              {{ getCellValue(row - 1, col - 1) }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <Teleport :to="activeCell === null ? 'body' : activeCell">
      <div style="display: flex; align-items: center; height: 40px; padding: 8px">
        <GooseInput
          ref="editableInput"
          v-model="editable"
          @blur="deactivateCell"
          @esc="deactivateCell"
          @down="activateCell(activeRow + 1, activeCol)"
          @up="activateCell(activeRow - 1, activeCol)"
        />
      </div>
    </Teleport>
  </div>
  {{ activeRow }}
  {{ activeCol }}
</template>

<style lang="sass" scoped>
  td
    line-height: 1.2rem

  td.editable
    cursor: pointer
</style>
