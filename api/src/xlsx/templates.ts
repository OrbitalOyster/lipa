import ExcelJS from 'exceljs'
import { XLSXWorksheet } from './XLSXWorksheet.ts'

import type {
  Cell,
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

async function parseXLSXFile(file: File) {
  const buffer = await file.arrayBuffer(),
    workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const worksheets = []
  workbook.eachSheet(
    w => worksheets.push(new XLSXWorksheet(w))
  )
  return { worksheets }
}

export const validate = async (file: File) => {
  try {
    const workbook = await parseXLSXFile(file)
    workbook.worksheets[0].findTables()
  }
  catch (err) {
    console.log(err)
    return { ok: false, err: 'Unable to parse'}
  }

  return { ok: true }
}
