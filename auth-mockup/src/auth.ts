import type { Context } from 'hono'
import { setTimeout as sleep } from 'node:timers/promises'
import { updateCookie } from './cookies'

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
  await updateCookie(context, username, role)
  return context.json({ username, role })
}
