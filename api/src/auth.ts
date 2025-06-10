import type { Context } from 'hono'
import connect from './mysqlConnection.ts'
import { setTimeout as sleep } from 'node:timers/promises'
import crypto from 'crypto'
import { updateCookie } from './cookies'

const authDelay = 2000

export const auth = async (context: Context) => {
  await sleep(authDelay)
  const { userId, isOrg, password, rememberMe } = await context.req.json<AuthRequest>()

  try {
    const connection = await connect(),
      passwordHash = crypto.createHash('sha256').update(password).digest('hex'),
      query = isOrg ? 
        `SELECT * FROM orgs WHERE id = '${userId}' AND passwordHash = '${passwordHash}'` :
        `SELECT * FROM users WHERE name = '${userId}' AND passwordHash = '${passwordHash}'`,
      [rows] = await connection.query(query)
    await connection.end()
    if (rows.length === 0) {
      console.log('Auth failed')
      return context.json(false)
    }
    else {
      const username = rows[0].name
      console.log('Auth OK', username)
      /* Update cookie and return ok */
      await updateCookie(context, { username, isOrg })
      return context.json(true)
    }
  }
  catch (error) {
    console.log(error)
    return context.json(null)
  }
}

export const logout = async (context: Context) => {
  await updateCookie(context, { username: null, role: null })
  return context.text('logout')
}
