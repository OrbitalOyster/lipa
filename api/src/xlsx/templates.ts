import ExcelJS from 'exceljs'
import { XLSXWorksheet } from './XLSXWorksheet.ts'

async function parseXLSXFile(file: File) {
  const buffer = await file.arrayBuffer(),
    workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const worksheets: XLSXWorksheet[] = []
  workbook.eachSheet(
    w => worksheets.push(new XLSXWorksheet(w)),
  )
  return { worksheets }
}

export const validate = async (file: File) => {
  try {
    const workbook = await parseXLSXFile(file)
    if (workbook.worksheets[0])
      workbook.worksheets[0].findTables()
  }
  catch (err) {
    console.log(err)
    return { ok: false, err: 'Unable to parse' }
  }

  return { ok: true }
}
