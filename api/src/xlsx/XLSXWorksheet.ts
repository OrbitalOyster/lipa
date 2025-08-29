import type {
  Row,
  Worksheet,
} from 'exceljs'

import { XLSXCell } from './XLSXCell.ts'

const tableNameRegexp = /\([0-9]{1,5}\)/

class XLSXWorksheet {
  public name = ''
  public rows = []

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

    /* Parse rows */
    worksheet.eachRow(
      { includeEmpty: true },
      (row, rowNum) =>
        this.rows.push(this.parseRow(row, rowNum)),
    )
  }

  private parseRow(row, rowNum) {
    const parsedRow: (XLSXCell | null)[] = []
    /* For each cell */
    row.eachCell(
      { includeEmpty: true },
      (cell, colNum) =>
        parsedRow.push(new XLSXCell(cell, rowNum, colNum)),
    )
    return parsedRow
  }

  private getCell(rowNum: number, colNum: number) {
    return this.rows[rowNum - 1][colNum - 1]
  }

  private cellHasTopBorder(cell: XLSXCell) {
    const { rowNum, colNum } = cell,
      topCell = this.getCell(rowNum - 1, colNum)
    return !!(topCell?.borders?.['bottom'] || cell.borders?.['top'])
  }

  private cellHasRightBorder(cell: XLSXCell) {
    const { rowNum, colNum } = cell,
      rightCell = this.getCell(rowNum, colNum + 1)
    return !!(rightCell?.borders?.['left'] || cell.borders?.['right'])
  }

  private cellIsTopRightCorner(cell: XLSXCell) {
    return this.cellHasTopBorder(cell) && this.cellHasRightBorder(cell)
  }

  public findTables() {
    for (const row of this.rows)
      for (const cell of row)
        if (cell.value && cell.value.toString().match(tableNameRegexp)) {
          console.log(`Table name match at ${cell.address}`)
          const topRightCell = this.getCell(cell.rowNum + 1, cell.colNum)
          console.log(`Is top right corner: ${this.cellIsTopRightCorner(topRightCell)}`);
        }
  }


}

export { XLSXWorksheet }
