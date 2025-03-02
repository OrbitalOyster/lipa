import { getSignedCookie, setCookie, setSignedCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import type { Context } from 'hono'

const getCookie = async (context: Context) => {
  const cookieName = Bun.env['COOKIE_NAME'],
    cookieSecret = Bun.env['COOKIE_SECRET'],
    tokenSecret = Bun.env['TOKEN_SECRET']
  const cookie = await getSignedCookie(
    context,
    cookieSecret,
    cookieName,
  )
  if (!cookie)
    return null
  return <UserPayload> await verify(cookie, tokenSecret)
}

const updatePayload = async (context: Context, payload) => {
  const cookieName = Bun.env['COOKIE_NAME'],
    cookieSecret = Bun.env['COOKIE_SECRET'],
    cookieLifetimeSec = Number(Bun.env['COOKIE_LIFETIME_SEC']),
    tokenSecret = Bun.env['TOKEN_SECRET']
  const oldPayload = getCookie(context)
  const newPayload = Object.assign(oldPayload, payload)
  // newPayload.exp = Math.floor(Date.now() / 1000) + cookieLifetimeSec
  const token = await sign(newPayload, tokenSecret)
  await setSignedCookie(context, cookieName, token, cookieSecret, {
    path: '/',
    httpOnly: true,
    maxAge: cookieLifetimeSec,
    sameSite: 'Strict',
  })
}

export const updateCookie = async (context: Context, username: string, role: string) => {
  const cookieName = Bun.env['COOKIE_NAME'],
    cookieSecret = Bun.env['COOKIE_SECRET'],
    cookieLifetimeSec = Number(Bun.env['COOKIE_LIFETIME_SEC']),
    tokenSecret = Bun.env['TOKEN_SECRET']
  const payload = {
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + cookieLifetimeSec,
  }
  const token = await sign(payload, tokenSecret)
  await setSignedCookie(context, cookieName, token, cookieSecret, {
    path: '/',
    httpOnly: true,
    maxAge: cookieLifetimeSec,
    sameSite: 'Strict',
  })
}

export const checkCookie = async (context: Context) => {
  const cookieName = Bun.env['COOKIE_NAME'],
    cookieSecret = Bun.env['COOKIE_SECRET'],
    tokenSecret = Bun.env['TOKEN_SECRET']
  const cookie = await getSignedCookie(
    context,
    cookieSecret,
    cookieName,
  )
  if (!cookie)
    return context.json(null)
  const decoded = <UserPayload> await verify(cookie, tokenSecret)
  if (!decoded)
    return context.json(null)
  const { username, role } = { ...decoded }
  if (!username || !role) {
    console.log('Haxxor alert')
    return context.json(null)
  }
  await updateCookie(context, username, role)
  return context.json({ username, role })
}

export const clearCookie = (context: Context) => {
  const cookieName = Bun.env['COOKIE_NAME']
  setCookie(context, cookieName, '', {
    path: '/',
    httpOnly: true,
    sameSite: 'Strict',
  })
  return context.json('logout')
}
