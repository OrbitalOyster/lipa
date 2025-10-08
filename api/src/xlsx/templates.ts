import type { Context } from 'hono'
import ExcelJS from 'exceljs'
import { XLSXWorksheet } from './XLSXWorksheet.ts'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import { getPayload } from '../routes/cookies.ts'

const attachmentName = 'attachment',
  uploadsFolder = '/tmp'

async function parseXLSXFile(buffer: ArrayBuffer) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const worksheets: XLSXWorksheet[] = []
  workbook.eachSheet(w => worksheets.push(new XLSXWorksheet(w)))
  return { worksheets }
}

export const validate = async (buffer: ArrayBuffer) => {
  try {
    const workbook = await parseXLSXFile(buffer)
    if (workbook.worksheets[0]) {
      const tables = workbook.worksheets[0].findTables()
      return { tables }
    }
    return { err: 'No worksheets' }
  }
  catch (err) {
    return { err: 'Unable to parse' }
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
  /* Validate */
  const bufferArray = await attachment.arrayBuffer(),
    validation = await validate(bufferArray)
  /* Unable to parse  validate */
  if (validation.err)
    return context.json(validation)
  /* Save to tmp, return hash */
  const buffer = Buffer.from(bufferArray),
    hash = createHash('sha256').update(buffer).digest('hex'),
    time = new Date().valueOf(),
    fullFilename = `${uploadsFolder}/${userId}-${time}-${attachment.name}`,
    filenameHash = createHash('sha256').update(fullFilename).digest('hex')
  console.log(`Uploaded '${attachment.name}'
    size ${attachment.size}
    user ${userId}
    time ${time}
    hash ${hash}`)
  await fs.writeFile(`${uploadsFolder}/${filenameHash}`, buffer)
  console.log('Saved to disk: ', filenameHash)
  return context.json({
    tables: validation.tables,
    key: filenameHash,
  })
}
