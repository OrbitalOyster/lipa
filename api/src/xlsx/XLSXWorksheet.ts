import type { Row, Worksheet } from 'exceljs'

import { XLSXCell } from './XLSXCell.ts'

type XLSXRow = XLSXCell[]
type SafeDataType = null | number | string | boolean | Date

interface Table {
  name: string
  rowNum: number
  colNum: number
  width: number
  height: number
  range: string
  aliasRow: number
  aliasCol: number
}

interface Editable {
  alias: string[]
  address: string
}

const isSafeDataType = (value: unknown) => {
  if (
    value === null
    || typeof value === 'number'
    || typeof value === 'string'
    || typeof value === 'boolean'
  )
    return true

  if (value instanceof Date) return true

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
    worksheet.eachRow({ includeEmpty: true }, row =>
      this.rowHeights.push(row.height || defaultRowHeight),
    )

    /* Fill col widths */
    const colWidths = worksheet.columns
      .map(c => c.width || defaultColWidth)
      .slice(0, dimensions.right)

    this.width = worksheet.columnCount
    this.height = worksheet.rowCount

    this.merges = merges
    this.colWidths = colWidths

    /* Parse rows */
    worksheet.eachRow({ includeEmpty: true }, (row, rowNum) =>
      this.rows.push(this.parseRow(row, rowNum)),
    )
  }

  private parseRow(row: Row, rowNum: number) {
    const parsedRow: XLSXRow = []

    /* For each cell */
    row.eachCell({ includeEmpty: true }, (cell, colNum) =>
      parsedRow.push(new XLSXCell(this, cell, rowNum, colNum)),
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
        if (value && isSafeDataType(value)) newRow[c] = value
      }
      result[r] = newRow
    }
    return result as SafeDataType[][]
  }

  public getCell(rowNum: number, colNum: number) {
    return this.rows[rowNum - 1]?.[colNum - 1]
  }

  private findBottomRightCorner(topRightCorner: XLSXCell) {
    const col = topRightCorner.colNum
    let row = topRightCorner.rowNum + 1,
      currentCell = this.getCell(row, col)
    while (currentCell?.isRightSide()) currentCell = this.getCell(++row, col)
    const bottomRightCorner = this.getCell(row - 1, col)
    if (bottomRightCorner?.isBottomRightCorner()) return bottomRightCorner
    else return null
  }

  private findBottomLeftCorner(bottomRightCorner: XLSXCell) {
    const row = bottomRightCorner.rowNum
    let col = bottomRightCorner.colNum - 1,
      currentCell = this.getCell(row, col)
    while (currentCell?.isBottomSide()) currentCell = this.getCell(row, --col)
    const bottomLeftCorner = this.getCell(row, col + 1)
    if (bottomLeftCorner?.isBottomLeftCorner()) return bottomLeftCorner
    else return null
  }

  private findTopLeftCorner(bottomLeftCorner: XLSXCell) {
    const col = bottomLeftCorner.colNum
    let row = bottomLeftCorner.rowNum - 1,
      currentCell = this.getCell(row, col)
    while (currentCell?.isLeftSide()) currentCell = this.getCell(--row, col)
    const topLeftCorner = this.getCell(row + 1, col)
    if (topLeftCorner?.isTopLeftCorner()) return topLeftCorner
    else return null
  }

  private findTopRightCorner(topLeftCorner: XLSXCell) {
    const row = topLeftCorner.rowNum
    let col = topLeftCorner.colNum + 1,
      currentCell = this.getCell(row, col)
    while (currentCell?.isTopSide()) currentCell = this.getCell(row, ++col)
    const topRightCorner = this.getCell(row, col - 1)
    if (topRightCorner?.isTopRightCorner()) return topRightCorner
    else return null
  }

  private findTableAliasRow(
    rowNum: number,
    colNum: number,
    width: number,
    height: number,
  ) {
    /* Find first "1" */
    for (let row = rowNum; row < rowNum + height; row++)
      if (this.getCell(row, colNum)?.isTableCellAlias()) {
        /* Check whole row */
        let checkedCells = 0
        for (let col = colNum; col < colNum + width; col++)
          if (!this.getCell(row, col)?.isTableCellAlias()) break
          else checkedCells++
        if (checkedCells === width) return row
      }
    /* Bad */
    return -1
  }

  private findTableAliasCol(
    rowNum: number,
    colNum: number,
    width: number,
    height: number,
    aliasRow: number,
  ) {
    for (let col = colNum; col < colNum + width; col++)
      if (this.getCell(aliasRow + 1, col)?.isTableCellAlias()) {
        /* Check whole col */
        let checkedCells = 0
        for (let row = aliasRow + 1; row < rowNum + height; row++)
          if (!this.getCell(row, col)?.isTableCellAlias()) break
          else checkedCells++
        if (checkedCells === rowNum + height - aliasRow - 1) return col
      }
    /* Bad */
    return -1
  }

  private findTables() {
    const result = []
    for (const row of this.rows)
      for (const cell of row)
        if (cell.isTableName()) {
          /* Table name */
          const name = cell.value,
            topRightCorner = this.getCell(cell.rowNum + 1, cell.colNum)
          /* Found top right corner */
          if (topRightCorner?.isTopRightCorner()) {
            const bottomRightCorner = this.findBottomRightCorner(topRightCorner),
              bottomLeftCorner = bottomRightCorner && this.findBottomLeftCorner(bottomRightCorner),
              topLeftCorner = bottomLeftCorner && this.findTopLeftCorner(bottomLeftCorner)
            /* Success */
            if (topLeftCorner && this.findTopRightCorner(topLeftCorner) === topRightCorner) {
              const width = topRightCorner.colNum - topLeftCorner.colNum + 1,
                height = bottomLeftCorner.rowNum - topLeftCorner.rowNum + 1,
                rowNum = topLeftCorner.rowNum,
                colNum = topLeftCorner.colNum,
                aliasRow = this.findTableAliasRow(rowNum, colNum, width, height)
              if (aliasRow === -1)
                throw new Error('Invalid table (missing alias row)')
              const aliasCol = this.findTableAliasCol(rowNum, colNum, width, height, aliasRow)
              if (aliasCol === -1)
                throw new Error('Invalid table (missing alias col)')
              /* Done */
              result.push({
                name,
                rowNum,
                colNum,
                width,
                height,
                aliasRow,
                aliasCol,
                range: `${topLeftCorner.address}:${bottomRightCorner.address}`,
              })
            }
          }
        }
    return result
  }

  private findEditables(tables: Table[]) {
    const result: Editable[] = []
    tables.forEach((table) => {
      for (let row = table.aliasRow; row < table.rowNum + table.height; row++)
        for (let col = table.aliasCol; col < table.colNum + table.width; col++) {
          const cell = this.getCell(row, col)
          if (!cell)
            throw new Error('Major screwup')
          if (!cell?.value) {
            const aliasC = this.getCell(table.aliasRow, col)?.value?.toString(),
              aliasR = this.getCell(row, table.aliasCol)?.value?.toString(),
              address = cell?.address
            result.push({
              alias: [aliasR, aliasC],
              address,
            })
          }
        }
    })
    return result
  }

  public serialize() {
    const rows = this.rows.map(r => r.map(c => c.serialize())),
      tables = this.findTables(),
      editables = this.findEditables(tables)
    return {
      name: this.name,
      width: this.width,
      height: this.height,
      rows,
      tables,
      editables,
      merges: this.merges,
      rowHeights: this.rowHeights,
      colWidths: this.colWidths,
    }
  }
}
