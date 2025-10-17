import { getMySQLDate, parseQuery } from '../utils'
import type { Context } from 'hono'
import type { RowDataPacket } from 'mysql2'
import connect from '../mysqlConnection.ts'
import { setTimeout as sleep } from 'node:timers/promises'

interface CountRowsResult extends RowDataPacket {
  total: number
}

export const templates = async (context: Context) => {
  await sleep(500)
  const {
      size,
      fromDate,
      toDate,
      sortBy,
      desc,
    } = parseQuery(context, ['date', 'filename']),
    connection = await connect(),
    [countRows] = await connection.query<CountRowsResult[]>('SELECT COUNT(*) as total FROM templates'),
    total = countRows[0]!.total,
    query = `SELECT date, userId, filename `
      + `FROM templates `
      + `WHERE date BETWEEN '${getMySQLDate(fromDate)}' AND '${getMySQLDate(toDate)}' `
      + `ORDER BY ${sortBy} ${desc ? 'DESC ' : ''}`
      + `LIMIT ${size} `,
    [rows] = await connection.query(query)
  await connection.end()

  const totalPages = Math.ceil(total / size)
  let page = Number(context.req.query()['page']) || 0
  if (totalPages === 0)
    page = 0
  else if (page >= totalPages)
    page = totalPages - 1

  return context.json({
    page,
    size,
    sortBy,
    desc,
    total,
    rows,
  })
}
