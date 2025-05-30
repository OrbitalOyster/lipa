import type { Context } from 'hono'
import type { RowDataPacket } from 'mysql2/promise'
import mysql from 'mysql2/promise'

interface Org extends RowDataPacket {
  id: string
  ord: string
  name: string
  parent: string | null
}

const dbUser = Bun.env['DB_USER'],
  dbPassword = Bun.env['DB_PASSWORD'],
  dbPort = Bun.env['DB_PORT'],
  dbName = Bun.env['DB_NAME'],
  dbHost = Bun.env['DB_HOST'],
  connectionString = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

export const orgs = async (context: Context) => {
  try {
    const connection = await mysql.createConnection(connectionString),
      [rows] = await connection.query<Org[]>('SELECT * FROM orgs ORDER BY ord'),
      parsedRows = rows.map(org => ({
        id: org.id,
        ord: org.ord,
        name: org.name,
        parent: org.parent ?? undefined, /* Ignore 'null' parent */
      }))
    await connection.end()
    return context.json(parsedRows)
  }
  catch (error) {
    console.log(error)
    return context.json(null)
  }
}
