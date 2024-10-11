import { decode, sign, verify } from 'hono/jwt'
import { cors } from 'hono/cors'
import { Hono } from 'hono'

import {
  getSignedCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'

// Config
const cookieName = process.env.COOKIE_NAME
const cookieLifetimeSec = Number(process.env.COOKIE_LIFETIME_SEC)
const cookieSecret = process.env.COOKIE_SECRET
const tokenSecret = process.env.TOKEN_SECRET
const port = process.env.PORT
const origin = process.env.ALLOWED_ORIGIN

const sample_username = 'orbital'
const sample_password = 'password'
const sample_role = 'admin'

const app = new Hono()

// Allow cross-origin resource sharing
app.use('*', cors({ origin, credentials: true }))

async function updateCookie(c, username, role) {
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
    }
  )
}

// Auth attempt
app.post('/auth', async (c) => {
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

app.get('/check', async (c) => {
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
  await updateCookie(c, username, role)
  return c.json({username, role})
})

app.get('/logout', (c) => {
  deleteCookie(c, cookieName)
  return c.json("logout")
})

export default {
  fetch: app.fetch,
  port
}

// bun run --hot index.ts
