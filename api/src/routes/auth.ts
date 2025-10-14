import { clearCookie, updateCookie } from './cookies'
import type { Context } from 'hono'
import type { RowDataPacket } from 'mysql2'
import connect from '../mysqlConnection.ts'
import crypto from 'crypto'
import { setTimeout as sleep } from 'node:timers/promises'

const authDelay = 2000

export const auth = async (context: Context) => {
  await sleep(authDelay)
  /* Get user credentials from request */
  const { userId, isOrg, password, rememberMe } = await context.req.json<AuthRequest>()
  try {
    /* Query DB */
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
      const name = (rows[0] as AuthSQLResult).name
      console.log('Auth OK', userId, name)
      /* Update cookie and return ok */
      await updateCookie(context, { userId, isOrg, name, rememberMe })
      return context.json(true)
    }
  }
  catch (error) {
    console.log(error)
    return context.json(null)
  }
}

export const logout = (context: Context) => {
  clearCookie(context)
  return context.json('logout')
}
