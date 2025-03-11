import { getPayload, updateCookie } from './cookies'
import type { Context } from 'hono'
import { setTimeout as sleep } from 'node:timers/promises'

/* Placeholder credentials */
const sampleUsername = 'orbital',
  samplePassword = 'password',
  sampleRole = 'admin',
  authDelay = 2000

export const auth = async (context: Context) => {
  await sleep(authDelay)
  const { username, password } = await context.req.json<AuthRequest>()
  /* DB check mock up */
  if (username !== sampleUsername || samplePassword !== password) {
    console.log('Auth failed')
    return context.json(false)
  }
  console.log('Auth OK', username)
  /* Update cookie and return ok */
  await updateCookie(context, {username, role: sampleRole})
  return context.json(true)
}

export const logout = async (context: Context) => {
  await updateCookie(context, {username: null, role: null})
  return context.text('logout')
}
