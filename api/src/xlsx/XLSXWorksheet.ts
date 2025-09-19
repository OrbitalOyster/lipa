import type {
  Row,
  Worksheet,
} from 'exceljs'

import { XLSXCell } from './XLSXCell.ts'

type XLSXRow = XLSXCell[]

class XLSXWorksheet {
  public name = ''
  public rows: XLSXRow[] = []

  private readonly merges
  private readonly colWidths

  constructor(worksheet: Worksheet) {
    this.name = worksheet.name

    const dimensions = worksheet.dimensions,
      merges = worksheet.model.merges,
      defaultRowHeight = worksheet.properties.defaultRowHeight,
      defaultColWidth = worksheet.properties.defaultColWidth || -1,
      rowHeights = []

    /* Fill row heights */
    worksheet.eachRow({ includeEmpty: true }, row =>
      rowHeights.push(row.height || defaultRowHeight))
    /* Fill col widths */
    const colWidths = worksheet.columns
      .map(c => c.width || defaultColWidth)
      .slice(0, dimensions.right)

    this.merges = merges
    this.colWidths = colWidths

    /* Parse rows */
    worksheet.eachRow(
      { includeEmpty: true },
      (row, rowNum) =>
        this.rows.push(this.parseRow(row, rowNum)),
    )
  }

  private parseRow(row: Row, rowNum: number) {
    const parsedRow: XLSXRow = []
    /* For each cell */
    row.eachCell(
      { includeEmpty: true },
      (cell, colNum) =>
        parsedRow.push(new XLSXCell(this, cell, rowNum, colNum)),
    )
    return parsedRow
  }

  public getCell(rowNum: number, colNum: number) {
    return this.rows[rowNum - 1]?.[colNum - 1]
  }

  private findBottomRightCorner(topRightCorner: XLSXCell) {
    const col = topRightCorner.colNum
    let row = topRightCorner.rowNum + 1,
      currentCell = this.getCell(row, col)
    while (currentCell && currentCell.isRightSide())
      currentCell = this.getCell(++row, col)
    const bottomRightCorner = this.getCell(row - 1, col)
    if (bottomRightCorner && bottomRightCorner.isBottomRightCorner())
      return bottomRightCorner
    else
      return null
  }

  private findBottomLeftCorner(bottomRightCorner: XLSXCell) {
    const row = bottomRightCorner.rowNum
    let col = bottomRightCorner.colNum - 1,
      currentCell = this.getCell(row, col)
    while (currentCell && currentCell.isBottomSide())
      currentCell = this.getCell(row, --col)
    const bottomLeftCorner = this.getCell(row, col + 1)
    if (bottomLeftCorner && bottomLeftCorner.isBottomLeftCorner())
      return bottomLeftCorner
    else
      return null
  }

  private findTopLeftCorner(bottomLeftCorner: XLSXCell) {
    const col = bottomLeftCorner.colNum
    let row = bottomLeftCorner.rowNum - 1,
      currentCell = this.getCell(row, col)
    while (currentCell && currentCell.isLeftSide())
      currentCell = this.getCell(--row, col)
    const topLeftCorner = this.getCell(row + 1, col)
    if (topLeftCorner && topLeftCorner.isTopLeftCorner())
      return topLeftCorner
    else
      return null
  }

  private findTopRightCorner(topLeftCorner: XLSXCell) {
    const row = topLeftCorner.rowNum
    let col = topLeftCorner.colNum + 1,
      currentCell = this.getCell(row, col)
    while (currentCell && currentCell.isTopSide())
      currentCell = this.getCell(row, ++col)
    const topRightCorner = this.getCell(row, col - 1)
    if (topRightCorner && topRightCorner.isTopRightCorner())
      return topRightCorner
    else
      return null
  }

  public findTables() {
    for (const row of this.rows)
      for (const cell of row)
        if (cell && cell.isTableName()) {
          console.log(`Table name match at ${cell.address}`)
          const topRightCorner = this.getCell(cell.rowNum + 1, cell.colNum)
          /* Found top right corner */
          if (topRightCorner && topRightCorner.isTopRightCorner()) {
            const bottomRightCorner = this.findBottomRightCorner(topRightCorner),
              bottomLeftCorner = bottomRightCorner && this.findBottomLeftCorner(bottomRightCorner),
              topLeftCorner = bottomLeftCorner && this.findTopLeftCorner(bottomLeftCorner)
            /* Success */
            if (topLeftCorner && this.findTopRightCorner(topLeftCorner) === topRightCorner) {
              const width = topRightCorner.colNum - topLeftCorner.colNum + 1,
                height = bottomLeftCorner.rowNum - topLeftCorner.rowNum + 1
              console.log(
                topRightCorner.address,
                bottomRightCorner?.address,
                bottomLeftCorner?.address,
                topLeftCorner?.address,
                width, height,
              )
            }
          }
        }
  }
}

export { XLSXWorksheet }
