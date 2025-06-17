import type { Context } from 'hono'
import type { RowDataPacket } from 'mysql2'
import connect from './mysqlConnection.ts'
import crypto from 'crypto'
import { setTimeout as sleep } from 'node:timers/promises'
import { updateCookie } from './cookies'

const authDelay = 2000

export const auth = async (context: Context) => {
  await sleep(authDelay)
  const { userId, isOrg, password, rememberMe } = await context.req.json<AuthRequest>()
  try {
    const connection = await connect(),
      passwordHash = crypto.createHash('sha256').update(password).digest('hex'),
      query = isOrg
        ? `SELECT * FROM orgs WHERE id = '${userId}' AND passwordHash = '${passwordHash}'`
        : `SELECT * FROM users WHERE name = '${userId}' AND passwordHash = '${passwordHash}'`,
      [rows] = await connection.query<RowDataPacket[]>(query)
    await connection.end()
    if (!rows[0]) {
      console.log('Auth failed')
      return context.json(false)
    }
    else {
      const username = rows[0]['name'],
        orgId = rows[0]['id'] || null
      console.log('Auth OK', username)
      /* Update cookie and return ok */
      await updateCookie(context, { username, orgId, rememberMe })
      return context.json(true)
    }
  }
  catch (error) {
    console.log(error)
    return context.json(null)
  }
}

export const logout = async (context: Context) => {
  await updateCookie(context, { username: null, orgId: null, rememberMe: null })
  return context.text('logout')
}
