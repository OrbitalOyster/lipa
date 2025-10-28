import { getMySQLDate, parseQuery } from '../utils.ts'
import type { Context } from 'hono'
import ExcelJS from 'exceljs'
import type { RowDataPacket } from 'mysql2'
import { XLSXWorksheet } from '../xlsx/XLSXWorksheet.ts'
import connect from '../mysqlConnection.ts'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import { getPayload } from './cookies.ts'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

interface CountRowsResult extends RowDataPacket {
  total: number
}

/* TODO: .env */
const attachmentName = 'attachment',
  uploadsFolder = path.join('volume', 'tmp'),
  xlsxFolder = path.join('volume', 'xlsx')

const parseXLSXFile = async (buffer: ArrayBuffer) => {
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
    if (!workbook.worksheets) return { err: 'No worksheets' }
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

export const checkFilenameExists = async (filename: string) => {
  const connection = await connect(),
    query = `SELECT COUNT(filename) AS filenameExists FROM xlsx WHERE filename = '${filename}'`,
    [rows] = await connection.query<RowDataPacket[]>(query),
    result = !!(rows[0]! as CheckFilenameQueryResult)['filenameExists']
  await connection.end()
  return result
}

const checkHashExists = async (hash: string) => {
  const connection = await connect(),
    query = `SELECT filename, COUNT(hash) AS hashExists FROM xlsx WHERE hash = '${hash}'`,
    [rows] = await connection.query<RowDataPacket[]>(query),
    result = rows[0]! as CheckHashQueryResult
  await connection.end()
  return !!result.hashExists && result.filename
}

export const upload = async (context: Context) => {
  await sleep(1000)
  const payload = await getPayload(context),
    userId = payload['userId'] /* Who */,
    body = await context.req.parseBody(),
    attachment = body[attachmentName] /* What */
    /* No attachment, somehow */
  if (!attachment || !(attachment instanceof File)) return context.json(
    'Missing attachment',
    400,
  )

  /* Validate */
  const bufferArray = await attachment.arrayBuffer(),
    validation = await validate(bufferArray)

  /* Unable to parse or validate */
  if ('err' in validation) return context.json(validation)

  /* Save to tmp, return hash */
  const buffer = Buffer.from(bufferArray),
    hash = createHash('sha256').update(buffer)
      .digest('hex'),
    time = new Date().valueOf(),
    fullFilename = path.join(uploadsFolder, `${userId}-${time}-${attachment.name}`),
    filenameHash = createHash('sha256').update(fullFilename).digest('hex'),
    filenameExists = await checkFilenameExists(attachment.name),
    hashExists = await checkHashExists(hash)

  console.log(`Uploaded '${attachment.name}'
    size ${attachment.size}
    user ${userId}
    time ${time}
    hash ${hash}
    filename exists: ${filenameExists}
    hash exists: ${hashExists}`)

  await fs.writeFile(path.join(uploadsFolder, filenameHash), buffer)
  console.log('Saved to disk: ', filenameHash)

  return context.json({
    filenameExists,
    hashExists,
    worksheets: validation,
    key: filenameHash,
  })
}

export const sync = async (context: Context) => {
  /* Actual files */
  const files = await fs.readdir(xlsxFolder)
  /* DB files */
  const connection = await connect(),
    [rows] = await connection.query('SELECT filename, hash FROM xlsx')
  await connection.end()
  console.log(files)
  console.log(rows)
  return context.json('Ok')
}

export const save = async (context: Context) => {
  const payload = await getPayload(context),
    userId = payload['userId'],
    { key, filename } = await context.req.json<SaveXLSXRequest>()
  const srcFile = path.join(uploadsFolder, key)
  try {
    /* Check if DB filename exists */
    if (await checkFilenameExists(filename)) throw new Error('Filename taken (says DB)')

    /* Check if src file exists */
    await fs.access(
      srcFile,
      fs.constants.F_OK,
    )

    /* Get hash (again) */
    const file = await fs.readFile(srcFile),
      buffer = Buffer.from(file.buffer),
      hash = createHash('sha256').update(buffer)
        .digest('hex')

    /* Check if hash is already taken */
    const hashExists = await checkHashExists(hash)
    if (hashExists) throw new Error(`Hash exists: ${hashExists}`)

    /* Copy from tmp folder */
    await fs.copyFile(
      srcFile, path.join(xlsxFolder, filename),
      fs.constants.COPYFILE_EXCL,
    )

    /* Query DB */
    const connection = await connect(),
      insertQuery = `INSERT INTO xlsx (userId, filename, hash) VALUES ("${userId}", "${filename}", "${hash}")`
    await connection.query(insertQuery)
    await connection.end()
  }
  catch (err) {
    console.error(err)
    return context.json(
      'Try again',
      400,
    )
  }
  return context.json('Ok')
}

export const xlsx = async (context: Context) => {
  await sleep(500)
  const { size, fromDate, toDate, sortBy, desc } = parseQuery(
      context,
      [
        'date',
        'filename',
      ],
    ),
    connection = await connect(),
    [countRows] = await connection.query<CountRowsResult[]>('SELECT COUNT(*) as total FROM xlsx'),
    total = countRows[0]!.total,
    query
      = 'SELECT date, userId, filename, SUBSTRING(hash, 1, 8) AS hash '
        + 'FROM xlsx '
        + `WHERE date BETWEEN '${getMySQLDate(fromDate)}' AND '${getMySQLDate(toDate)}' `
        + `ORDER BY ${sortBy} ${desc ? 'DESC ' : ''}`
        + `LIMIT ${size} `,
    [rows] = await connection.query(query)
  await connection.end()

  const totalPages = Math.ceil(total / size)
  let page = Number(context.req.query()['page']) || 0
  if (totalPages === 0) page = 0
  else if (page >= totalPages) page = totalPages - 1

  return context.json({
    page,
    size,
    sortBy,
    desc,
    total,
    rows,
  })
}

interface XLSXQueryResult extends RowDataPacket {
  filename: string
  hash: string
}

const getXLSXByHash = async (hash: string) => {
  const connection = await connect(),
    query = `SELECT * FROM xlsx WHERE hash LIKE '${hash}%'`,
    [rows] = await connection.query<XLSXQueryResult[]>(query)
  await connection.end()
  if (!rows.length) return null
  else return rows[0]
}

export const xlsxByHash = async (context: Context) => {
  const hash = context.req.param('hash'),
    xlsx = await getXLSXByHash(hash)
  if (xlsx === null) return context.json(
    'Nothing here',
    404,
  )
  else return context.json(xlsx)
}

export const xlsxDelete = async (context: Context) => {
  const hash = context.req.param('hash'),
    xlsx = await getXLSXByHash(hash)
  if (!xlsx) return context.json(
    'Nothing here',
    404,
  )
  else {
    const connection = await connect(),
      query = `DELETE FROM xlsx WHERE hash = '${xlsx['hash']}%'`
    await connection.query(query)
    await connection.end()
    await fs.unlink(path.join(xlsxFolder, xlsx['filename']))
    return context.json('Ok')
  }
}
