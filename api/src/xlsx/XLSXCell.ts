import type { Cell, CellValue } from 'exceljs'
import { ValueType } from 'exceljs'
import { XLSXWorksheet } from './XLSXWorksheet'

interface SerializedCell {
  address: string
  type: ValueType
  value: CellValue
  borders: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  rowSpan?: number
  colSpan?: number
}

export class XLSXCell {
  private worksheet
  public readonly rowNum
  public readonly colNum
  public readonly type
  public readonly address
  public readonly style
  public readonly value
  public readonly borders
  private rowSpan = 1
  private colSpan = 1

  constructor(worksheet: XLSXWorksheet, cell: Cell, rowNum: number, colNum: number) {
    this.worksheet = worksheet

    /* exceljs is numbering rows and cols from 1. Stoopid */
    this.rowNum = rowNum
    this.colNum = colNum

    this.type = cell.model.type
    this.address = cell.address
    this.style = cell.model.style

    /* Don't set value on merged on empty cells */
    if (this.type !== ValueType.Null && this.type !== ValueType.Merge)
      this.value = cell.value

    this.borders = this.parseBorders(cell)
    console.log(this.borders)
  }

  public setSpans(rowSpan: number, colSpan: number) {
    this.rowSpan = rowSpan
    this.colSpan = colSpan
  }

  private parseBorders(cell: Cell) {
    const style = cell.style
    return {
      top: style.border?.top?.style || undefined,
      right: style.border?.right?.style || undefined,
      bottom: style.border?.bottom?.style || undefined,
      left: style.border?.left?.style || undefined,
    }
  }

  /* === */

  public hasTopBorder() {
    const topNeighbor = this.worksheet.getCell(
      this.rowNum - 1,
      this.colNum,
    )
    return !!(this.borders?.['top'] || topNeighbor?.borders?.['bottom'])
  }

  public hasRightBorder() {
    const rightNeighbor = this.worksheet.getCell(
      this.rowNum,
      this.colNum + 1,
    )
    return !!(this.borders?.['right'] || rightNeighbor?.borders?.['left'])
  }

  public hasBottomBorder() {
    const bottomNeighbor = this.worksheet.getCell(
      this.rowNum + 1,
      this.colNum,
    )
    return !!(this.borders?.['bottom'] || bottomNeighbor?.borders?.['top'])
  }

  public hasLeftBorder() {
    const leftNeighbor = this.worksheet.getCell(
      this.rowNum,
      this.colNum - 1,
    )
    return !!(this.borders?.['left'] || leftNeighbor?.borders?.['right'])
  }

  /* === */

  public hasVerticalBorders() {
    return this.hasLeftBorder() || this.hasRightBorder()
  }

  public hasHorizontalBorders() {
    return this.hasTopBorder() || this.hasBottomBorder()
  }

  /* === */

  public isRightSide() {
    const rightNeighbor = this.worksheet.getCell(
      this.rowNum,
      this.colNum + 1,
    )
    return this.hasRightBorder() && !rightNeighbor?.hasHorizontalBorders()
  }

  public isBottomSide() {
    const bottomNeighbor = this.worksheet.getCell(
      this.rowNum + 1,
      this.colNum,
    )
    return this.hasBottomBorder() && !bottomNeighbor?.hasVerticalBorders()
  }

  public isLeftSide() {
    const leftNeighbor = this.worksheet.getCell(
      this.rowNum,
      this.colNum - 1,
    )
    return this.hasLeftBorder() && !leftNeighbor?.hasHorizontalBorders()
  }

  public isTopSide() {
    const topNeighbor = this.worksheet.getCell(
      this.rowNum - 1,
      this.colNum,
    )
    return this.hasTopBorder() && !topNeighbor?.hasVerticalBorders()
  }

  /* === */

  public isTopRightCorner() {
    const topNeighbor = this.worksheet.getCell(
        this.rowNum - 1,
        this.colNum,
      ),
      rightNeighbor = this.worksheet.getCell(
        this.rowNum,
        this.colNum + 1,
      )
    return this.hasTopBorder()
      && this.hasRightBorder()
      && !topNeighbor?.hasVerticalBorders()
      && !rightNeighbor?.hasHorizontalBorders()
  }

  public isBottomRightCorner() {
    const bottomNeighbor = this.worksheet.getCell(
        this.rowNum + 1,
        this.colNum,
      ),
      rightNeighbor = this.worksheet.getCell(
        this.rowNum,
        this.colNum + 1,
      )
    return this.hasBottomBorder()
      && this.hasRightBorder()
      && !bottomNeighbor?.hasVerticalBorders()
      && !rightNeighbor?.hasHorizontalBorders()
  }

  public isBottomLeftCorner() {
    const bottomNeighbor = this.worksheet.getCell(
        this.rowNum + 1,
        this.colNum,
      ),
      leftNeighbor = this.worksheet.getCell(
        this.rowNum,
        this.colNum - 1,
      )
    return this.hasBottomBorder()
      && this.hasLeftBorder()
      && !bottomNeighbor?.hasVerticalBorders()
      && !leftNeighbor?.hasHorizontalBorders()
  }

  public isTopLeftCorner() {
    const topNeighbor = this.worksheet.getCell(
        this.rowNum - 1,
        this.colNum,
      ),
      leftNeighbor = this.worksheet.getCell(
        this.rowNum,
        this.colNum - 1,
      )
    return this.hasTopBorder()
      && this.hasLeftBorder()
      && !topNeighbor?.hasVerticalBorders()
      && !leftNeighbor?.hasHorizontalBorders()
  }

  /* === */

  public isTableName() {
    /* Cell has string value */
    if (this.type === ValueType.String && this.value) {
      const tableNameRegexp = /\([0-9]{1,5}\)/
      if ((this.value as string)?.match(tableNameRegexp)) return true
    }
    return false
  }

  /* === */

  public serialize() {
    const result: SerializedCell = {
      address: this.address,
      type: this.type,
      value: this.value,
      borders: this.borders,
    }

    /* Ignore spans less than 2 */
    if (this.rowSpan > 1)
      result.rowSpan = this.rowSpan
    if (this.colSpan > 1)
      result.colSpan = this.colSpan

    return result
  }
}
