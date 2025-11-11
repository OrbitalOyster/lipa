import type { Cell, CellValue, Style } from 'exceljs'
import { ValueType } from 'exceljs'
import { XLSXWorksheet } from './XLSXWorksheet'

interface CellBorders {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

type TextAlign = 'left' | 'center' | 'right'
type VerticalAlign = 'top' | 'middle' | 'bottom'

interface SerializedCell {
  address: string
  type: ValueType
  value: CellValue
  borders?: CellBorders
  backgroundColor?: string
  rowSpan?: number
  colSpan?: number
  textAlign?: TextAlign
  verticalAlign?: VerticalAlign
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
  public readonly backgroundColor
  public readonly textAlign?: TextAlign
  public readonly verticalAlign?: VerticalAlign
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

    /* Borders */
    this.borders = this.parseBorders(this.style)

    /* Background color */
    this.backgroundColor = this.parseBackgroundColor(this.style)

    if (this.style.alignment) {
      this.textAlign = this.parseHorizontalAlignment(this.style)
      this.verticalAlign = this.parseVerticalAlignment(this.style)
    }
  }

  public setSpans(rowSpan: number, colSpan: number) {
    this.rowSpan = rowSpan
    this.colSpan = colSpan
  }

  private parseBorders(style: Style) {
    const result: CellBorders = {}

    if (style.border?.top?.style)
      result.top = style.border.top.style
    if (style.border?.right?.style)
      result.right = style.border.right.style
    if (style.border?.bottom?.style)
      result.bottom = style.border.bottom.style
    if (style.border?.left?.style)
      result.left = style.border.left.style

    return result
  }

  private parseBackgroundColor(style: Style) {
    if (style?.fill
      && 'pattern' in style.fill
      && style?.fill.pattern === 'solid'
      && style?.fill.fgColor?.argb)
      return `#${style.fill.fgColor.argb.slice(2)}`
    else
      return null
  }

  private parseHorizontalAlignment(style: Style) {
    switch (style.alignment.horizontal) {
      case 'general':
      case 'left':
        return 'left'
      case 'center':
        return 'center'
      case 'right':
        return 'right'
      default:
        /* Unsupported */
        throw new Error('Unsupported horizontal alignment: ' + style.alignment.horizontal)
    }
  }

  private parseVerticalAlignment(style: Style) {
    switch (style.alignment.vertical) {
      case 'top':
        return 'top'
      case 'middle':
        return 'middle'
      case 'bottom':
        return 'bottom'
      default:
        /* Unsupported */
        throw new Error('Unsupported vertical alignment')
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
    }

    if (Object.keys(this.borders).length)
      result.borders = this.borders

    if (this.backgroundColor)
      result.backgroundColor = this.backgroundColor

    if (this.verticalAlign)
      result.verticalAlign = this.verticalAlign

    if (this.textAlign)
      result.textAlign = this.textAlign

    /* Ignore spans less than 2 */
    if (this.rowSpan > 1)
      result.rowSpan = this.rowSpan
    if (this.colSpan > 1)
      result.colSpan = this.colSpan

    return result
  }
}
