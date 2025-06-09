import type { Context } from 'hono'
import { setTimeout as sleep } from 'node:timers/promises'
import mysql from 'mysql2/promise'
import crypto from 'crypto'
import { updateCookie } from './cookies'

/* Placeholder credentials */
const sampleRole = 'admin',
  authDelay = 2000

const dbUser = Bun.env['DB_USER'],
  dbPassword = Bun.env['DB_PASSWORD'],
  dbPort = Bun.env['DB_PORT'],
  dbName = Bun.env['DB_NAME'],
  dbHost = Bun.env['DB_HOST'],
  connectionString = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

export const auth = async (context: Context) => {
  await sleep(authDelay)
  const { userId, isOrg, password, rememberMe } = await context.req.json<AuthRequest>()

  try {
    const connection = await mysql.createConnection(connectionString),
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
  }
  catch (error) {
    console.log(error)
    return context.json(null)
  }

  console.log('Auth OK', userId)
  /* Update cookie and return ok */
  await updateCookie(context, { username: userId, role: sampleRole })
  return context.json(true)
}

export const logout = async (context: Context) => {
  await updateCookie(context, { username: null, role: null })
  return context.text('logout')
}
