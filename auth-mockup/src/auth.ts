import { getPayload, updateCookie } from './cookies'
import type { Context } from 'hono'
import { setTimeout as sleep } from 'node:timers/promises'

// Placeholder credentials
const sampleUsername = 'orbital',
  samplePassword = 'password',
  sampleRole = 'admin',
  authDelay = 2000

export const auth = async (context: Context) => {
  await sleep(authDelay)
  const { username, password } = await context.req.json<AuthRequest>()
  // DB check mock up
  if (username !== sampleUsername || samplePassword !== password) {
    console.log('Auth failed')
    return context.json(null)
  }
  const role = sampleRole
  console.log('Auth OK', username)
  const payload = await getPayload(context)
  payload.username = username
  payload.role = role
  await updateCookie(context, payload)
  return context.json({ username, role })
}

export const logout = async (context: Context) => {
  const payload = await getPayload(context)
  if (payload) {
    delete payload.username
    delete payload.role
    await updateCookie(context, payload)
  }
  return context.text('logout')
}
