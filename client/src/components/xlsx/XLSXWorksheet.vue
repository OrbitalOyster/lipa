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
  previous = ref(''),
  editable = ref(''),
  editableInput = useTemplateRef('editableInput')

const data = ref<Record<string, number | string>>({
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

const isActiveCell = (r: number, c: number) => {
  return activeRow.value === r && activeCol.value === c
}

const getCellValue = (r: number, c: number) => {
  const cell = getCell(r, c)
  if (!cell)
    return ''
  if (cell.type === ValueType.Formula)
    return 'Σ'
  if (isEditableCell(r, c)) {
    const ed = model.value?.editables.find(e => e.address === cell.address),
      fullAlias = `${ed?.alias[0]} ${ed?.alias[1]}`,
      cellData = data.value[fullAlias] ?? ''
    return cellData
  }
  return cell.value as string
}

const activateCell = async (r: number, c: number) => {
  if (!editableInput.value)
    throw new Error('Majow screwup')
  /* Trying to activate already active cell */
  if (activeRow.value === r && activeCol.value === c)
    return
  /* Ignore uneditable cells */
  if (!isEditableCell(r, c))
    return
  const cell = getCell(r, c)
  if (!cell)
    throw new Error('Majow screwup')

  /* Deactivate previous cell */
  // if (activeRow.value !== null && activeCol.value !== null)
  //   deactivateCell()

  activeCell.value = '#' + cell.address

  editable.value = getCellValue(r, c)?.toString() ?? ''
  previous.value = getCellValue(r, c)?.toString() ?? ''

  editableInput.value.focus()
  await nextTick()
  editableInput.value.selectAll()

  activeRow.value = r
  activeCol.value = c
}

const deactivateCell = (saveValue: boolean) => {
  /* Should not happen */
  if (!editableInput.value)
    throw new Error('Majow screwup')
  // editableInput.value.blur()

  if (saveValue && previous.value !== editable.value) {
    if (activeRow.value === null || activeCol.value === null)
      return
    const cell = getCell(activeRow.value, activeCol.value),
      ed = model.value?.editables.find(e => e.address === cell.address),
      fullAlias = `${ed?.alias[0]} ${ed?.alias[1]}`
    console.log(`New value: ${editable.value}`)
    data.value[fullAlias] = editable.value
  }

  activeCell.value = null
  activeRow.value = null
  activeCol.value = null
}

const onTdMouseDown = (e: MouseEvent, row: number, col: number) => {
  const cell = getCell(row, col)
  if (!cell)
    throw new Error('Majow screwup')
  if (isEditableCell(row, col) && !isActiveCell(row, col))
    e.preventDefault()
}

const keyNavigation = async (e: KeyboardEvent) => {
  if (activeRow.value === null || activeCol.value === null)
    return
  const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter']
  if (navigationKeys.includes(e.key))
    e.preventDefault()
  else
    return

  /* Remember active cell */
  const r = activeRow.value,
    c = activeCol.value

  switch (e.key) {
    case 'ArrowUp':
      deactivateCell(true)
      await activateCell(r - 1, c)
      break
    case 'ArrowDown':
    case 'Enter':
      deactivateCell(true)
      await activateCell(r + 1, c)
      break
    case 'ArrowLeft':
      deactivateCell(true)
      await activateCell(r, c - 1)
      break
    case 'ArrowRight':
      deactivateCell(true)
      await activateCell(r, c + 1)
      break
  }
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
          v-for="(r, row) in model?.height"
          :key="r"
        >
          <template
            v-for="(c, col) in model?.width"
            :key="c"
          >
            <td
              v-if="!isMergedCell(row, col)"
              :id="getCell(row, col)?.address"
              :class="[isEditableCell(row, col) && 'editable']"
              :style="getCellStyle(row, col)"
              :rowSpan="getCell(row, col)?.rowSpan"
              :colSpan="getCell(row, col)?.colSpan"
              @mousedown="e => onTdMouseDown(e, row, col)"
              @click="activateCell(row, col)"
            >
              <template v-if="!isActiveCell(row, col)">
                {{ getCellValue(row, col) }}
              </template>
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
          @keydown="keyNavigation"
        />
      </div>
    </Teleport>
  </div>
  {{ previous }}
  {{ activeRow }}
  {{ activeCol }}
</template>

<style lang="sass" scoped>
  td
    line-height: 1.2rem

  td.editable
    cursor: pointer

  td.editable:hover
    box-shadow: inset 0px 0px 0px 2px #76D7C4
</style>
