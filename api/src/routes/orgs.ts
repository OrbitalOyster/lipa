import type { Context } from 'hono'
import connect from '../mysqlConnection.ts'
import { setTimeout as sleep } from 'node:timers/promises'

export const orgs = async (context: Context) => {
  await sleep(1000)
  try {
    const connection = await connect(),
      [rows] = await connection.query<Org[]>('SELECT * FROM orgs ORDER BY ord'),
      parsedRows = rows.map(org => ({
        id: org.id,
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
