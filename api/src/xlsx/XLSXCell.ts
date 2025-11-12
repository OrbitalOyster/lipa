import type { Alignment, BorderStyle, Borders, Cell, CellValue, Font, Style } from 'exceljs'
import { ValueType } from 'exceljs'
import { XLSXWorksheet } from './XLSXWorksheet'

type Border = 'thin' | 'hair' | 'medium' | 'thick'
type TextAlign = 'left' | 'center' | 'right'
type VerticalAlign = 'top' | 'middle' | 'bottom'

interface CellBorders {
  top?: Border
  right?: Border
  bottom?: Border
  left?: Border
}

interface CellFont {
  color?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

interface SerializedCell {
  address: string
  type: ValueType
  value: CellValue
  borders?: CellBorders
  font?: CellFont
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
  public readonly font
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

    /* Don't set extra properties on merged on empty cells */
    if (this.type !== ValueType.Merge) {
      if (this.type !== ValueType.Null)
        this.value = cell.value

      /* Borders */
      if (this.style.border)
        this.borders = this.parseBorders(this.style.border)

      /* Font */
      if (this.style.font)
        this.font = this.parseFont(this.style.font)

      /* Background color */
      this.backgroundColor = this.parseBackgroundColor(this.style)

      /* Text alignment */
      if (this.style.alignment) {
        this.textAlign = this.parseHorizontalAlignment(this.style)
        this.verticalAlign = this.parseVerticalAlignment(this.style)
      }
    }
  }

  public setSpans(rowSpan: number, colSpan: number) {
    this.rowSpan = rowSpan
    this.colSpan = colSpan
  }

  private checkBorderStyle(style: BorderStyle) {
    const supportedStyles = ['thin', 'hair', 'medium', 'thick']
    if (supportedStyles.includes(style))
      return style as Border
    else {
      console.warn('Unsupported border style', style)
      return 'thin'
    }
  }

  private parseBorders(border: Partial<Borders>) {
    const result: CellBorders = {}

    if (border.top?.style)
      result.top = this.checkBorderStyle(border.top.style)
    if (border.right?.style)
      result.right = this.checkBorderStyle(border.right.style)
    if (border?.bottom?.style)
      result.bottom = this.checkBorderStyle(border.bottom.style)
    if (border?.left?.style)
      result.left = this.checkBorderStyle(border.left.style)

    return result
  }

  private parseFont(font: Partial<Font>) {
    const result: CellFont = {}
    if (font.bold)
      result.bold = true
    if (font.italic)
      result.italic = true
    if (font.underline)
      result.underline = true
    if (font.color?.argb)
      result.color = '#' + font.color.argb.slice(2)

    return result
  }

  private parseBackgroundColor(style: Style) {
    if (style?.fill
      && 'pattern' in style.fill
      && style?.fill.pattern === 'solid'
      && style?.fill.fgColor?.argb)
      return '#' + style.fill.fgColor.argb.slice(2)
    else
      return null
  }

  private parseHorizontalAlignment(style: Style) {
    /* 'general' somehow not included in horizontal alignment */
    switch (style.alignment.horizontal as Alignment['horizontal'] | 'general') {
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

  /* "1", "1.2.3", "5.6", ... */
  public isTableCellAlias() {
    if (!this.value)
      return false
    if (this.type !== ValueType.Number && this.type !== ValueType.String)
      return false
    const aliasRegexp = /^\d+(\.\d+)*$/,
      value = (this.value as string).toString().trim()
    return aliasRegexp.test(value)
  }

  /* === */

  public serialize() {
    const result: SerializedCell = {
      address: this.address,
      type: this.type,
      value: this.value,
    }

    if (this.borders && Object.keys(this.borders).length)
      result.borders = this.borders

    if (this.font && Object.keys(this.font).length)
      result.font = this.font

    if (this.backgroundColor)
      result.backgroundColor = this.backgroundColor

    /* Bottom align is default */
    if (this.verticalAlign && this.verticalAlign !== 'bottom')
      result.verticalAlign = this.verticalAlign

    /* Left align is default */
    if (this.textAlign && this.textAlign !== 'left')
      result.textAlign = this.textAlign

    /* Ignore spans less than 2 */
    if (this.rowSpan > 1)
      result.rowSpan = this.rowSpan
    if (this.colSpan > 1)
      result.colSpan = this.colSpan

    return result
  }
}
