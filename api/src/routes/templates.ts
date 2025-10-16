import { getMySQLDate, parseQuery } from '../utils'
import type { Context } from 'hono'
import connect from '../mysqlConnection.ts'

export const templates = async (context: Context) => {
  const {
      size,
      fromDate,
      toDate,
      sortBy,
      desc,
    } = parseQuery(context, ['date', 'filename']),
    connection = await connect(),
    query = `SELECT date, userId, filename `
      + `FROM templates `
      + `WHERE date BETWEEN '${getMySQLDate(fromDate)}' AND '${getMySQLDate(toDate)}' `
      + `ORDER BY ${sortBy} ${desc ? 'DESC ' : ''}`
      + `LIMIT ${size} `,
    [rows] = await connection.query(query)
  console.log(query)
  await connection.end()

  return context.json(rows)
}
