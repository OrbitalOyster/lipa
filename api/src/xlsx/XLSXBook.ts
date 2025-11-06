import ExcelJS from 'exceljs'
import { HyperFormula } from 'hyperformula'
import { XLSXWorksheet } from './XLSXWorksheet'

export class XLSXBook {
  private readonly buffer: ArrayBuffer
  private worksheets: XLSXWorksheet[] = []
  private readonly hyperformula

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer
    this.hyperformula = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
  }

  async load() {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(this.buffer)
    workbook.eachSheet((sheet) => {
      const xlsxWorksheet = new XLSXWorksheet(sheet)

      const sheetName = this.hyperformula.addSheet(xlsxWorksheet.name),
        sheetId = this.hyperformula.getSheetId(sheetName),
        tableData = xlsxWorksheet.getData()

      /* Should not happen */
      if (sheetId === undefined)
        throw new Error('Major screwup')

      this.hyperformula.setCellContents({
        row: 0,
        col: 0,
        sheet: sheetId,
      }, tableData)

      this.worksheets.push(xlsxWorksheet)
    })
  }

  serialize() {
    return this.worksheets.map(w => w.serialize())
  }
}
