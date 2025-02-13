import { getSignedCookie, setCookie, setSignedCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import type { Context } from 'hono'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { setTimeout as sleep } from 'node:timers/promises'

// Types
interface AuthRequest {
  username: string
  password: string
}

interface UserPayload {
  username?: string
  role?: string
}

declare module 'bun' {
  interface Env {
    COOKIE_NAME: string
    COOKIE_LIFETIME_SEC: number
    COOKIE_SECRET: string
    TOKEN_SECRET: string
    PORT: number
    ALLOWED_ORIGIN: string
  }
}

// Config
const cookieName = Bun.env['COOKIE_NAME']
const cookieLifetimeSec = Bun.env['COOKIE_LIFETIME_SEC']
const cookieSecret = Bun.env['COOKIE_SECRET']
const tokenSecret = Bun.env['TOKEN_SECRET']
const port = Bun.env['PORT']
const origin = Bun.env['ALLOWED_ORIGIN']

// Check config
if (!cookieName || !cookieLifetimeSec || !cookieSecret || !tokenSecret || !port || !origin)
  throw new Error('Missing .env config')

const sampleUsername = 'orbital',
  samplePassword = 'password',
  sampleRole = 'admin'

const app = new Hono()

// Allow cross-origin resource sharing
app.use('*', cors({ origin, credentials: true }))

app.get('/', (c) => {
  return c.text('You\'re doing it wrong')
})

async function updateCookie(c: Context, username: string, role: string) {
  const payload = {
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + cookieLifetimeSec,
  }
  const token = await sign(payload, tokenSecret)
  await setSignedCookie(
    c,
    cookieName,
    token,
    cookieSecret,
    {
      path: '/',
      httpOnly: true,
      maxAge: cookieLifetimeSec,
      sameSite: 'Strict',
    },
  )
}

// Auth attempt
app.post('/auth', async (c) => {
  await sleep(2500)
  const { username, password } = await c.req.json<AuthRequest>()
  // DB check mock up
  if (username !== sampleUsername || samplePassword !== password) {
    console.log('Auth failed')
    return c.json(null)
  }
  const role = sampleRole
  console.log('Auth OK', username)
  await updateCookie(c, username, role)
  return c.json({ username, role })
})

app.get('/check', async (c) => {
  const cookie = await getSignedCookie(
    c,
    cookieSecret,
    cookieName,
  )
  if (!cookie)
    return c.json(null)
  const decoded = <UserPayload> await verify(cookie, tokenSecret)
  if (!decoded)
    return c.json(null)
  const { username, role } = { ...decoded }
  if (!username || !role) {
    console.log('Haxxor alert')
    return c.json(null)
  }
  await updateCookie(c, username, role)
  return c.json({ username, role })
})

app.get('/logout', (c) => {
  setCookie(
    c,
    cookieName,
    '',
    {
      path: '/',
      httpOnly: true,
      sameSite: 'Strict',
    },
  )
  return c.json('logout')
})

export default {
  fetch: app.fetch,
  port,
}
