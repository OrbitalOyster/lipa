import ExcelJS from 'exceljs'
import { HyperFormula } from 'hyperformula'
import { XLSXWorksheet } from './XLSXWorksheet'

export class XLSXBook {
  buffer: ArrayBuffer
  worksheets: XLSXWorksheet[] = []

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer
  }

  async load() {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(this.buffer)
    workbook.eachSheet(w => this.worksheets.push(new XLSXWorksheet(w)))
  }

  serialize() {
    return this.worksheets.map(w => w.serialize())
  }
}
