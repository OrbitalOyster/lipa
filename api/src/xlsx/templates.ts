import ExcelJS from 'exceljs'

class Worksheet {

}

class Workbook {
  public async loadFromBuffer(buffer: Buffer) {
    const ejsWorkbook = new ExcelJS.Workbook()
    await ejsWorkbook.xlsx.load(buffer)
  }
}

export const validate = async (file: File) => {
  const buffer = await file.arrayBuffer(),
    workbook = new ExcelJS.Workbook()

  try {
    await workbook.xlsx.load(buffer)
    workbook.eachSheet((worksheet, sheetId) =>  {
      console.log(worksheet.name)      
    })
  }
  catch (err) {
    return { ok: false, err: 'Unable to parse'}
  }

  return { ok: true }
}
