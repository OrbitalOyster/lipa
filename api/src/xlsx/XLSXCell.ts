import type {
  Cell,
} from 'exceljs'
import { ValueType } from 'exceljs'

class XLSXCell {
  public rowNum = -1
  public colNum = -1
  public readonly type
  public readonly address
  public readonly style
  public readonly value
  public borders

  constructor(cell: Cell, rowNum: number, colNum: number) {
    this.rowNum = rowNum
    this.colNum = colNum

    this.type = cell.model.type
    this.address = cell.address
    this.style = cell.model.style
    this.value = cell.value
    this.borders = this.parseBorders(cell)
  }

  private parseBorders(cell: Cell) {
    const style = cell.style
    if (!style.border)
      return null
    if (
      !style.border.top
      && !style.border.right
      && !style.border.bottom
      && !style.border.left
    )
      return null
    return {
      top: style.border.top || null,
      right: style.border.right || null,
      bottom: style.border.bottom || null,
      left: style.border.left || null,
    }
  }

  public isTableName() {
    /* Cell has string value */
    if (this.type === ValueType.String && this.value) {
      const tableNameRegexp = /\([0-9]{1,5}\)/
      if ((this.value as string)?.match(tableNameRegexp))
        return true
    }
    return false
  }
}

export { XLSXCell }
