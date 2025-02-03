import { sign, verify } from 'hono/jwt'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import type { Context } from 'hono'

import { setTimeout as sleep } from 'node:timers/promises'

import {
  getSignedCookie,
  setCookie,
  setSignedCookie,
} from 'hono/cookie'

// Config
const cookieName = process.env['COOKIE_NAME']
const cookieLifetimeSec = Number(process.env['COOKIE_LIFETIME_SEC'])
const cookieSecret = process.env['COOKIE_SECRET']
const tokenSecret = process.env['TOKEN_SECRET']
const port = process.env['PORT']
const origin = process.env['ALLOWED_ORIGIN']

// Check config
if (!cookieName || !cookieLifetimeSec || !cookieSecret || !tokenSecret || !port || !origin)
  throw new Error('Missing .env config')

const sample_username = 'orbital'
const sample_password = 'password'
const sample_role = 'admin'

const app = new Hono()

// Allow cross-origin resource sharing
app.use('*', cors({ origin, credentials: true }))

async function updateCookie(c: Context, username: string, role: string) {
  const payload = {
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + cookieLifetimeSec,
  }
  if (!tokenSecret)
    throw new Error('Major screwup')
  const token = await sign(payload, tokenSecret)
  if (!cookieName || !cookieSecret)
    throw new Error('Major screwup')
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
    }
  )
}

// Auth attempt
app.post('/auth', async (c) => {

  await sleep(2500)

  const body = await c.req.json()
  const {username, password} = body

  // DB check mock up
  if (username !== sample_username || sample_password !== password) {
    console.log('Auth failed')
    return c.json(null)
  }
  const role = sample_role

  console.log("Auth OK", username)

  await updateCookie(c, username, role)
  return c.json({username, role})
})

app.get('/check', async (c: Context) => {
  const cookie = await getSignedCookie(
    c,
    cookieSecret,
    cookieName,
  )
  if (!cookie)
    return c.json(null)

  const decoded = await verify(cookie, tokenSecret)
  if (!decoded)
    return c.json(null)
  const {username, role} = {...decoded}
  if (!username || !role)
    throw new Error('Major screwup');
  await updateCookie(c, username as string, role as string)
  return c.json({username, role})
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
    }
  )
  return c.json("logout")
})

export default {
  fetch: app.fetch,
  port
}

// bun run --hot index.ts
