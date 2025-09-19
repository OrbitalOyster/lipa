import type {
  Cell,
} from 'exceljs'
import { ValueType } from 'exceljs'
import { XLSXWorksheet } from './XLSXWorksheet'

class XLSXCell {
  private worksheet
  public readonly rowNum
  public readonly colNum
  public readonly type
  public readonly address
  public readonly style
  public readonly value
  public borders

  constructor(worksheet: XLSXWorksheet, cell: Cell, rowNum: number, colNum: number) {
    this.worksheet = worksheet

    /* exceljs is numbering rows and cols from 1. Stoopid */
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
    /*
    if (!style.border)
      return null
    if (
      !style.border.top
      && !style.border.right
      && !style.border.bottom
      && !style.border.left
    )
      return null
    */
    return {
      top: style.border?.top || null,
      right: style.border?.right || null,
      bottom: style.border?.bottom || null,
      left: style.border?.left || null,
    }
  }

  /* === */

  public hasTopBorder() {
    const topNeighbor = this.worksheet.getCell(this.rowNum - 1, this.colNum)
    return !!(this.borders?.['top'] || topNeighbor?.borders?.['bottom'])
  }

  public hasRightBorder() {
    const rightNeighbor = this.worksheet.getCell(this.rowNum, this.colNum + 1)
    return !!(this.borders?.['right'] || rightNeighbor?.borders?.['left'])
  }

  public hasBottomBorder() {
    const bottomNeighbor = this.worksheet.getCell(this.rowNum + 1, this.colNum)
    return !!(this.borders?.['bottom'] || bottomNeighbor?.borders?.['top'])
  }

  public hasLeftBorder() {
    const leftNeighbor = this.worksheet.getCell(this.rowNum, this.colNum - 1)
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
    const rightNeighbor = this.worksheet.getCell(this.rowNum, this.colNum + 1)
    return this.hasRightBorder() && !rightNeighbor?.hasHorizontalBorders()
  }

  public isBottomSide() {
    const bottomNeighbor = this.worksheet.getCell(this.rowNum + 1, this.colNum)
    return this.hasBottomBorder() && !bottomNeighbor?.hasVerticalBorders()
  }

  public isLeftSide() {
    const leftNeighbor = this.worksheet.getCell(this.rowNum, this.colNum - 1)
    return this.hasLeftBorder() && !leftNeighbor?.hasHorizontalBorders()
  }

  public isTopSide() {
    const topNeighbor = this.worksheet.getCell(this.rowNum - 1, this.colNum)
    return this.hasTopBorder() && !topNeighbor?.hasVerticalBorders()
  }

  /* === */

  public isTopRightCorner() {
    const topNeighbor = this.worksheet.getCell(this.rowNum - 1, this.colNum),
      rightNeighbor = this.worksheet.getCell(this.rowNum, this.colNum + 1)
    return this.hasTopBorder()
      && this.hasRightBorder()
      && !topNeighbor?.hasVerticalBorders()
      && !rightNeighbor?.hasHorizontalBorders()
  }

  public isBottomRightCorner() {
    const bottomNeighbor = this.worksheet.getCell(this.rowNum + 1, this.colNum),
      rightNeighbor = this.worksheet.getCell(this.rowNum, this.colNum + 1)
    return this.hasBottomBorder()
      && this.hasRightBorder()
      && !bottomNeighbor?.hasVerticalBorders()
      && !rightNeighbor?.hasHorizontalBorders()
  }

  public isBottomLeftCorner() {
    const bottomNeighbor = this.worksheet.getCell(this.rowNum + 1, this.colNum),
      leftNeighbor = this.worksheet.getCell(this.rowNum, this.colNum - 1)
    return this.hasBottomBorder()
      && this.hasLeftBorder()
      && !bottomNeighbor?.hasVerticalBorders()
      && !leftNeighbor?.hasHorizontalBorders()
  }

  public isTopLeftCorner() {
    const topNeighbor = this.worksheet.getCell(this.rowNum - 1, this.colNum),
      leftNeighbor = this.worksheet.getCell(this.rowNum, this.colNum - 1)
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
      if ((this.value as string)?.match(tableNameRegexp))
        return true
    }
    return false
  }
}

export { XLSXCell }
