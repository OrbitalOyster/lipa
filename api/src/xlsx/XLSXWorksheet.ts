import type {
  Row,
  Worksheet,
} from 'exceljs'

import { XLSXCell } from './XLSXCell.ts'

type XLSXRow = XLSXCell[]
type SafeDataType = null | number | string | boolean | Date

const isSafeDataType = (value: unknown) => {
  if (
    value === null
    || typeof value === 'number'
    || typeof value === 'string'
    || typeof value === 'boolean'
  )
    return true

  if (value instanceof Date)
    return true

  return false
}

export class XLSXWorksheet {
  public readonly name
  public rows: XLSXRow[] = []
  public readonly merges
  public readonly rowHeights: number[]
  public readonly colWidths
  public readonly width
  public readonly height

  constructor(worksheet: Worksheet) {
    this.name = worksheet.name

    const dimensions = worksheet.dimensions,
      merges = worksheet.model.merges,
      defaultRowHeight = worksheet.properties.defaultRowHeight,
      defaultColWidth = worksheet.properties.defaultColWidth || -1

    this.rowHeights = []

    /* Fill row heights */
    worksheet.eachRow(
      { includeEmpty: true },
      row => this.rowHeights.push(row.height || defaultRowHeight),
    )

    /* Fill col widths */
    const colWidths = worksheet.columns
      .map(c => c.width || defaultColWidth)
      .slice(
        0,
        dimensions.right,
      )

    this.width = worksheet.columnCount
    this.height = worksheet.rowCount

    this.merges = merges
    this.colWidths = colWidths

    /* Parse rows */
    worksheet.eachRow(
      { includeEmpty: true },
      (row, rowNum) => this.rows.push(this.parseRow(
        row,
        rowNum,
      )),
    )
  }

  private parseRow(row: Row, rowNum: number) {
    const parsedRow: XLSXRow = []

    /* For each cell */
    row.eachCell(
      { includeEmpty: true },
      (cell, colNum) => parsedRow.push(new XLSXCell(
        this,
        cell,
        rowNum,
        colNum,
      )),
    )
    return parsedRow
  }

  public getData() {
    const result = new Array(this.height)
    for (let r = 0; r < this.height; r++) {
      const newRow = new Array(this.width).fill(null)
      for (let c = 0; c < this.width; c++) {
        /* Exceljs counts from 1 */
        const value = this.getCell(r + 1, c + 1)?.value
        if (value && isSafeDataType(value))
          newRow[c] = value
      }
      result[r] = newRow
    }
    return result as ((SafeDataType)[])[]
  }

  public getCell(rowNum: number, colNum: number) {
    return this.rows[rowNum - 1]?.[colNum - 1]
  }

  private findBottomRightCorner(topRightCorner: XLSXCell) {
    const col = topRightCorner.colNum
    let row = topRightCorner.rowNum + 1,
      currentCell = this.getCell(
        row,
        col,
      )
    while (currentCell?.isRightSide()) currentCell = this.getCell(
      ++row,
      col,
    )
    const bottomRightCorner = this.getCell(
      row - 1,
      col,
    )
    if (bottomRightCorner?.isBottomRightCorner()) return bottomRightCorner
    else return null
  }

  private findBottomLeftCorner(bottomRightCorner: XLSXCell) {
    const row = bottomRightCorner.rowNum
    let col = bottomRightCorner.colNum - 1,
      currentCell = this.getCell(
        row,
        col,
      )
    while (currentCell?.isBottomSide()) currentCell = this.getCell(
      row,
      --col,
    )
    const bottomLeftCorner = this.getCell(
      row,
      col + 1,
    )
    if (bottomLeftCorner?.isBottomLeftCorner()) return bottomLeftCorner
    else return null
  }

  private findTopLeftCorner(bottomLeftCorner: XLSXCell) {
    const col = bottomLeftCorner.colNum
    let row = bottomLeftCorner.rowNum - 1,
      currentCell = this.getCell(
        row,
        col,
      )
    while (currentCell?.isLeftSide()) currentCell = this.getCell(
      --row,
      col,
    )
    const topLeftCorner = this.getCell(
      row + 1,
      col,
    )
    if (topLeftCorner?.isTopLeftCorner()) return topLeftCorner
    else return null
  }

  private findTopRightCorner(topLeftCorner: XLSXCell) {
    const row = topLeftCorner.rowNum
    let col = topLeftCorner.colNum + 1,
      currentCell = this.getCell(
        row,
        col,
      )
    while (currentCell?.isTopSide()) currentCell = this.getCell(
      row,
      ++col,
    )
    const topRightCorner = this.getCell(
      row,
      col - 1,
    )
    if (topRightCorner?.isTopRightCorner()) return topRightCorner
    else return null
  }

  public findTables() {
    const result = []
    for (const row of this.rows) for (const cell of row) if (cell?.isTableName()) {
      /* Table name */
      const name = cell.value
      const topRightCorner = this.getCell(
        cell.rowNum + 1,
        cell.colNum,
      )

      /* Found top right corner */
      if (topRightCorner?.isTopRightCorner()) {
        const bottomRightCorner = this.findBottomRightCorner(topRightCorner),
          bottomLeftCorner = bottomRightCorner && this.findBottomLeftCorner(bottomRightCorner),
          topLeftCorner = bottomLeftCorner && this.findTopLeftCorner(bottomLeftCorner)

        /* Success */
        if (topLeftCorner && this.findTopRightCorner(topLeftCorner) === topRightCorner) {
          const width = topRightCorner.colNum - topLeftCorner.colNum + 1,
            height = bottomLeftCorner.rowNum - topLeftCorner.rowNum + 1
          result.push({
            name,
            width,
            height,
            range: `${topLeftCorner.address}:${bottomRightCorner.address}`,
          })
        }
      }
    }
    return result
  }

  public serialize() {
    const rows = this.rows.map(r => r.map(c => c.serialize()))
    return {
      name: this.name,
      width: this.width,
      height: this.height,
      rows,
      tables: this.findTables(),
      merges: this.merges,
      rowHeights: this.rowHeights,
      colWidths: this.colWidths,
    }
  }
}
