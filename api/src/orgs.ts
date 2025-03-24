import type { Context } from 'hono'
import type { RowDataPacket } from 'mysql2/promise'
import mysql from 'mysql2/promise'

const dbUser = Bun.env['DB_USER'],
  dbPassword = Bun.env['DB_PASSWORD'],
  dbPort = Bun.env['DB_PORT'],
  dbName = Bun.env['DB_NAME']

interface Org extends RowDataPacket {
  id: string
  ord: string
  name: string
}

export const orgs = async (context: Context) => {
  const connectionString = `mysql://${dbUser}:${dbPassword}@db:${dbPort}/${dbName}`
  try {
    const connection = await mysql.createConnection(connectionString)
    const sql = 'SELECT * FROM orgs ORDER BY ord'
    const [rows] = await connection.query<Org[]>(sql)
    const parsedRows = rows.map(org => ({ id: org.id, ord: org.ord, name: org.name }))
    return context.json(parsedRows)
  } catch (error) {
    console.log(error)
    return context.json(null)
  }
}
