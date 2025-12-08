<script setup lang="ts">
import { format, isTextFormat, parseValue } from 'numfmt'
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
  fmt: string
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

const locale = 'ru-RU'

const checkFmt = (input: string, fmt: string) => {
  const parsedInput = parseValue(input, { locale })
  /* Bogus input */
  if (parsedInput === null)
    return false
  const formattedInput = format(fmt, parsedInput.v, { locale })
  const parsedAgainInput = parseValue(formattedInput, { locale })
  /* Should not happen */
  if (parsedAgainInput === null)
    throw new Error('Major screwup')
  return parsedInput.v === parsedAgainInput.v
}

const model = defineModel<XLSXWorksheet>({ required: true }),
  activeCell = ref<null | string>(null),
  activeRow = ref<null | number>(null),
  activeCol = ref<null | number>(null),
  editableRef = ref(''),
  editableInput = useTemplateRef('editableInput')

let cellChanged = false

const data = ref<Record<string, number | string | boolean>>({
  '1_3': 100,
  '3.1_4': 200,
  '4_3': 1.5,
})

const cellExists = (rowIndex: number, colIndex: number) => {
  return rowIndex >= 0 && rowIndex < model.value.height
    && colIndex >= 0 && colIndex < model.value.width
/*
  const row = model.value.rows[rowIndex]
  if (!row)
    return false
  const cell = row[colIndex]
  if (!cell)
    return false
  return true
*/
}

const cellEmpty = (rowIndex: number, colIndex: number) => {
  const row = model.value.rows[rowIndex]
  if (!row)
    throw new Error('Major screwup')
  const cell = row[colIndex]
  if (!cell)
    return true
  return false
}

const getCell = (rowIndex: number, colIndex: number) => {
  const row = model.value.rows[rowIndex]
  if (!row)
    throw new Error('Major screwup')
  const cell = row[colIndex]
  if (!cell)
    throw new Error('Major screwup')
  return cell
}

const getEditable = (rowIndex: number, colIndex: number) => {
  const cell = getCell(rowIndex, colIndex),
    editable = model.value.editables.find(e => e.address === cell.address)
  if (!editable)
    throw new Error('Major screwup')
  return editable
}

const isMergedCell = (rowIndex: number, colIndex: number) => {
  const cell = getCell(rowIndex, colIndex)
  return cell.type === ValueType.Merge
}

const isEditableCell = (rowIndex: number, colIndex: number) => {
  const cell = getCell(rowIndex, colIndex),
    address = cell.address
  return !!model.value.editables.find(e => e.address === address)
}

const isActiveCell = (rowIndex: number, colIndex: number) => {
  return activeRow.value === rowIndex && activeCol.value === colIndex
}

const getCellValue = (rowIndex: number, colIndex: number) => {
  const cell = getCell(rowIndex, colIndex)
  if (cell.type === ValueType.Formula)
    return 'Σ'
  if (isEditableCell(rowIndex, colIndex)) {
    const editable = getEditable(rowIndex, colIndex),
      fullAlias = `${editable.alias[0]}_${editable.alias[1]}`,
      cellData = data.value[fullAlias] ?? '',
      fmt = editable.fmt
    if (!fmt)
      throw new Error('Invalid xlsx sheet')
    return format(fmt, cellData, { locale })
  }
  return cell.value as string
}

const activateCell = async (rowIndex: number, colIndex: number) => {
  if (!editableInput.value)
    throw new Error('Major screwup')
  /* Trying to activate already active cell */
  if (activeRow.value === rowIndex && activeCol.value === colIndex)
    return
  /* Ignore uneditable cells */
  if (!isEditableCell(rowIndex, colIndex))
    return
  const cell = getCell(rowIndex, colIndex)
  activeCell.value = '#' + cell.address
  editableRef.value = getCellValue(rowIndex, colIndex).toString()
  editableInput.value.focus()
  await nextTick()
  activeRow.value = rowIndex
  activeCol.value = colIndex
}

const deactivateCell = async () => {
  /* Should not happen */
  if (!editableInput.value)
    throw new Error('Major screwup')
  activeCell.value = null
  activeRow.value = null
  activeCol.value = null
  cellChanged = false
  await nextTick()
}

const onTdMouseDown = (e: MouseEvent, rowIndex: number, colIndex: number) => {
  if (!isActiveCell(rowIndex, colIndex) && isEditableCell(rowIndex, colIndex))
    e.preventDefault()
}

const onTdClick = async (row: number, col: number) => {
  if (isEditableCell(row, col) && isActiveCell(row, col))
    return
  /* Handle previously active cell */
  if (activeCell.value) {
    if (cellChanged)
      await submitActiveCell()
    await deactivateCell()
  }
  await activateCell(row, col)
  editableInput.value?.selectAll()
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const submitting = ref(false)

const submitActiveCell = async () => {
  if (activeRow.value === null || activeCol.value === null)
    throw new Error('Major screwup')
  const editable = getEditable(activeRow.value, activeCol.value),
    fullAlias = `${editable.alias[0]}_${editable.alias[1]}`,
    rawValue = editableRef.value,
    fmt = editable.fmt
  if (!isTextFormat(fmt) && !checkFmt(rawValue, fmt)) {
    console.error('Bogus input:', rawValue)
    return
  }
  const parsed = parseValue(rawValue, { locale })
  if (!parsed)
    throw new Error('Major screwup')
  data.value[fullAlias] = parsed.v

  console.log('Submitting...')
  submitting.value = true
  await sleep(1000)
  submitting.value = false

  console.log('Submitted value', data.value[fullAlias])
  cellChanged = false
}

const navigate = async (rowShift: number, colShift: number) => {
  if (activeRow.value === null || activeCol.value === null)
    throw new Error('Major screwup')
  /* Active cell */
  let rowIndex = activeRow.value,
    colIndex = activeCol.value
  rowIndex += rowShift
  colIndex += colShift
  if (cellChanged)
    await submitActiveCell()
  if (cellExists(rowIndex, colIndex) && isEditableCell(rowIndex, colIndex)) {
    await deactivateCell()
    await activateCell(rowIndex, colIndex)
  }
  editableInput.value?.selectAll()
}

const onTdKeyDown = async (e: KeyboardEvent) => {
  const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter']
  if (navigationKeys.includes(e.key)) {
    e.preventDefault()
    let rowShift = 0,
      colShift = 0
    switch (e.key) {
      case 'ArrowUp':
        rowShift -= 1
        break
      case 'ArrowDown':
      case 'Enter':
        rowShift += 1
        break
      case 'ArrowLeft':
        colShift -= 1
        break
      case 'ArrowRight':
        colShift += 1
        break
    }
    await navigate(rowShift, colShift)
  }
}

const WIDTH_M = ref('7.07'),
  HEIGHT_M = ref('1.25')

const getRowStyle = (rowIndex: number) => {
  /* Actual lunacy */
  const height = Math.round((model.value.rowHeights[rowIndex] ?? 0) * Number(HEIGHT_M.value) + 1) + 'px',
    style = {
      height,
    }
  return style
}

const getCellWidth = (colIndex: number) => {
  return (model.value.colWidths[colIndex] ?? 0) * Number(WIDTH_M.value) + 'px'
}

const getCellStyle = (rowIndex: number, colIndex: number) => {
  // BORDER_DEFAULT = '1px solid #DDD',
  const BORDER_DEFAULT = 'none',
    BORDER_MAP = {
      hair: '1px solid darkslategray',
      thin: '1px solid darkslategray',
      medium: '2px solid darkslategray',
      thick: '2px solid darkslategray',
      dotted: '2px dotted darkslategray',
      default: BORDER_DEFAULT,
    },
    width = getCellWidth(colIndex),
    cell = getCell(rowIndex, colIndex),
    borderTop = BORDER_MAP[cell.borders?.top ?? 'default'],
    borderRight = BORDER_MAP[cell.borders?.right ?? 'default'],
    borderBottom = BORDER_MAP[cell.borders?.bottom ?? 'default'],
    borderLeft = BORDER_MAP[cell.borders?.left ?? 'default'],
    fontWeight = cell.font?.bold ? 'bold' : 'normal',
    fontStyle = cell.font?.italic ? 'italic' : 'normal',
    textDecoration = cell.font?.underline ? 'underline' : 'none',
    backgroundColor = cell.backgroundColor,
    color = cell.font?.color,
    textAlign = cell.textAlign ?? 'left',
    verticalAlign = cell.verticalAlign ?? 'bottom',
    style = {
      backgroundColor,
      color,
      textAlign,
      verticalAlign,
      width,
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      fontWeight,
      fontStyle,
      textDecoration,
    }

  if (!cell.borders?.top && cellExists(rowIndex - 1, colIndex) && !cellEmpty(rowIndex - 1, colIndex)) {
    const topCell = getCell(rowIndex - 1, colIndex)
    style.borderTop = BORDER_MAP[topCell.borders?.bottom ?? 'default']
  }
  if (!cell.borders?.right && cellExists(rowIndex, colIndex + 1) && !cellEmpty(rowIndex, colIndex + 1)) {
    const rightCell = getCell(rowIndex, colIndex + 1)
    style.borderRight = BORDER_MAP[rightCell.borders?.left ?? 'default']
  }
  if (!cell.borders?.bottom && cellExists(rowIndex + 1, colIndex) && !cellEmpty(rowIndex + 1, colIndex)) {
    const bottomCell = getCell(rowIndex + 1, colIndex)
    style.borderBottom = BORDER_MAP[bottomCell.borders?.top ?? 'default']
  }
  if (!cell.borders?.left && cellExists(rowIndex, colIndex - 1) && !cellEmpty(rowIndex, colIndex)) {
    const leftCell = getCell(rowIndex, colIndex - 1)
    style.borderLeft = BORDER_MAP[leftCell.borders?.right ?? 'default']
  }

  return style
}
</script>

<template>
  <div>
    <table>
      <tbody>
        <tr
          v-for="(r, row) in model?.height"
          :key="r"
          :style="activeRow === row ? 'height: auto' : getRowStyle(row)"
        >
          <template
            v-for="(c, col) in model?.width"
            :key="c"
          >
            <td
              v-if="cellEmpty(row, col)"
              :style="{ width: getCellWidth(col) }"
            />
            <td
              v-else-if="!isMergedCell(row, col)"
              :id="getCell(row, col).address"
              :class="[isEditableCell(row, col) && 'editable']"
              :style="getCellStyle(row, col)"
              :rowSpan="getCell(row, col).rowSpan"
              :colSpan="getCell(row, col).colSpan"
              @mousedown="e => onTdMouseDown(e, row, col)"
              @click="onTdClick(row, col)"
            >
              <template v-if="!isActiveCell(row, col)">
                {{ getCellValue(row, col) }}
              </template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
  <hr>
  <div style="display: flex">
    <GooseInput v-model="WIDTH_M" />
    <GooseInput v-model="HEIGHT_M" />
  </div>
  {{ activeCell }}
  {{ data }}
  <Teleport :to="activeCell === null ? '#hidden' : activeCell">
    <div style="display: flex; align-items: center; height: 40px; padding: 8px">
      <GooseInput
        ref="editableInput"
        v-model="editableRef"
        :loading="submitting"
        disabled-on-loading
        @input="cellChanged = true"
        @blur="async () => cellChanged && await submitActiveCell() && await deactivateCell()"
        @esc="deactivateCell"
        @keydown="onTdKeyDown"
      />
    </div>
  </Teleport>
</template>

<style lang="sass" scoped>
  tr
    border-top: 1px solid #0000

  td
    padding-top: 1px
    padding-bottom: 2px
    padding-left: 2px
    padding-right: 2px

  div.content
    padding-top: 2px
    padding-bottom: 2px
    padding-left: 2px
    padding-right: 2px

  td.editable
    cursor: pointer
</style>
