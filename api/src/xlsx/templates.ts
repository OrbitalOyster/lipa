import ExcelJS from 'exceljs'

import type {
  Cell,
//  CellFormulaValue,
//  CellRichTextValue,
//  CellValue,
//  Row,
  Worksheet,
} from 'exceljs'

enum CellType {
  Empty = 0,
  Slave = 1,
  Number = 2,
  String = 3,
  Date = 4,
  Hypelink = 5,
  Formula = 6,
}

const tableNameRegexp = /\([0-9]{1,5}\)/

function parseCellBorders(cell: Cell) { 
  const style = cell.style
  if (!style.border)
    return false
  if (
    !style.border.top &&
    !style.border.right &&
    !style.border.bottom &&
    !style.border.left
  )
    return false
  return {
    top: style.border.top || false,
    right: style.border.right || false,
    bottom: style.border.bottom || false,
    left: style.border.left || false,
  }
}

class XLSXCell {
  constructor(cell: Cell) {
    this.type = cell.model.type
    this.address = cell.address,
    this.style = cell.model.style,
    this.value = cell.value,
    this.borders = parseCellBorders(cell)
  }
}

function parseRow(row, rowNum) {
  // console.log(`Parsing row #${rowNum}`)
  
  const parsedRow: (XLSXCell | null)[] = []
  /* For each cell */
  row.eachCell(
    { includeEmpty: true },
    (cell, colNum) =>
      // newRow.push(new XLSXCell(this, cell, rowNum, colNum)),
      parsedRow.push(new XLSXCell(cell)),
  )

  /* Empty row */
  // if (!parsedRow.length)
    // console.log('It\'s empty')

    
  return parsedRow
}

function parseWorksheet(worksheet: Worksheet) {
  // console.log(`Parsing sheet "${worksheet.name}"`);

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
  const rows = []
  worksheet.eachRow(
    { includeEmpty: true },
    (row, rowNum) =>
      rows.push(parseRow(row, rowNum)),
  )

  // console.log({merges, defaultRowHeight, defaultColWidth, rowHeights, colWidths})

  return { name: worksheet.name, rows }
}

async function parseXLSXFile(file: File) {
  const buffer = await file.arrayBuffer(),
    workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const worksheets = []
  workbook.eachSheet(
    w => worksheets.push(parseWorksheet(w))
  )

  return { worksheets }
}

function findTables(worksheet) {
  for (const row of worksheet.rows)
    for (const cell of row) {
      if (cell.value && cell.value.toString().match(tableNameRegexp))
        console.log(`Table name match at ${cell.address}`)
    }
}

export const validate = async (file: File) => {
  try {
    const workbook = await parseXLSXFile(file)
    findTables(workbook.worksheets[0])
  }
  catch (err) {
    return { ok: false, err: 'Unable to parse'}
  }

  return { ok: true }
}
