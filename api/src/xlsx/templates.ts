import type { Context } from 'hono'
import ExcelJS from 'exceljs'
import { XLSXWorksheet } from './XLSXWorksheet.ts'
// import fs from 'fs'
import { getPayload } from '../routes/cookies.ts'

const attachmentName = 'attachment'

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
    if (workbook.worksheets[0]) {
      const tables = workbook.worksheets[0].findTables()
      return { ok: true, tables }
    }
    return { ok: false, err: 'No worksheets' }
  }
  catch (err) {
    console.log(err)
    return { ok: false, err: 'Unable to parse' }
  }
}

export const upload = async (context: Context) => {
  const payload = await getPayload(context),
    userId = payload['userId'], /* Who */
    body = await context.req.parseBody(),
    attachment = body[attachmentName] /* What */
  /* No attachment, somehow */
  if (!attachment || !(attachment instanceof File))
    return context.json('Missing attachment', 400)
  console.log(`Uploaded file '${attachment.name}', size ${attachment.size}, by ${userId}`)
  // fs.writeFile('upload', await attachment.arrayBuffer(), () => console.log('saved to disk'))
  const validation = await validate(attachment)
  return context.json(validation)
}
