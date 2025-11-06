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
      /* Create Hyperformula sheet */
      this.hyperformula.setCellContents({
        row: 0,
        col: 0,
        sheet: sheetId,
      }, tableData)
      /* Handle spans */
      for (const merge of xlsxWorksheet.merges) {
        const address = this.hyperformula.simpleCellRangeFromString(merge, sheetId)
        if (!address)
          throw new Error('Major screwup')
        const [rowSpan, colSpan] = [
          address.end.row - address.start.row + 1,
          address.end.col - address.start.col + 1,
        ]
        xlsxWorksheet.getCell(address.start.row + 1, address.start.col + 1)
          ?.setSpans(rowSpan, colSpan)
      }

      this.worksheets.push(xlsxWorksheet)
    })
  }

  serialize() {
    return this.worksheets.map(w => w.serialize())
  }
}
