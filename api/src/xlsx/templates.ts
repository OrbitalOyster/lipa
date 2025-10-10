import type { Context } from 'hono'
import ExcelJS from 'exceljs'
import { XLSXWorksheet } from './XLSXWorksheet.ts'
import connect from '../mysqlConnection.ts'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import fsc from 'node:fs'
import { getPayload } from '../routes/cookies.ts'
import { setTimeout as sleep } from 'node:timers/promises'

/* TODO: .env */
const attachmentName = 'attachment',
  uploadsFolder = '/tmp',
  templatesFolder = './templates'

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
    /* No worksheets, somehow */
    if (!workbook.worksheets)
      return { err: 'No worksheets' }
    return workbook.worksheets.map(w => ({
      name: w.name,
      tables: w.findTables(),
    }))
  }
  catch (err) {
    console.error(err)
    return { err: 'Unable to parse' }
  }
}

export const upload = async (context: Context) => {
  await sleep(1000)
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
  /* Unable to parse or validate */
  if ('err' in validation)
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
    worksheets: validation,
    key: filenameHash,
  })
}

export const sync = () => {

}

const getHash = (path: string) => new Promise((resolve, reject) => {
  const hash = createHash('sha256')
  const rs = fsc.createReadStream(path)
  rs.on('error', reject)
  rs.on('data', chunk => hash.update(chunk))
  rs.on('end', () => resolve(hash.digest('hex')))
})

export const save = async (context: Context) => {
  const payload = await getPayload(context),
    userId = payload['userId'],
    { key, filename } = await context.req.json<SaveTemplateRequest>()
  const srcFile = `${uploadsFolder}/${key}`
  try {
    /* Get hash (again) */
    console.log(await getHash(srcFile))

    /* Check if src file exists */
    await fs.access(srcFile, fs.constants.F_OK)
    /* Copy */
    await fs.copyFile(srcFile, `${templatesFolder}/${filename}`, fs.constants.COPYFILE_EXCL)

    /* Query DB */
    const connection = await connect(),
      query = `INSERT INTO templates (userId, filename, hash) VALUES ("${userId}", "${filename}", "${12345}")`
    await connection.query(query)
    await connection.end()
  }
  catch (err) {
    console.error(err)
    return context.json('Try again', 400)
  }
  return context.json('Ok')
}
