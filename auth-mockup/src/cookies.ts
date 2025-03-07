import { getSignedCookie, setSignedCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import type { Context } from 'hono'

export const getPayload = async (context: Context) => {
  const cookieName = Bun.env['COOKIE_NAME'],
    cookieSecret = Bun.env['COOKIE_SECRET'],
    tokenSecret = Bun.env['TOKEN_SECRET']
  const cookie = await getSignedCookie(
    context,
    cookieSecret,
    cookieName,
  )
  if (!cookie)
    return {}
  return <UserPayload> await verify(cookie, tokenSecret)
}

export const updateCookie = async (context: Context, payload?: UserPayload) => {
  const cookieName = Bun.env['COOKIE_NAME'],
    cookieSecret = Bun.env['COOKIE_SECRET'],
    cookieLifetimeSec = Number(Bun.env['COOKIE_LIFETIME_SEC']),
    tokenSecret = Bun.env['TOKEN_SECRET']
  const newPayload = { ...payload }
  newPayload.exp = Math.floor(Date.now() / 1000) + cookieLifetimeSec
  const token = await sign(newPayload, tokenSecret)
  await setSignedCookie(context, cookieName, token, cookieSecret, {
    path: '/',
    httpOnly: true,
    maxAge: cookieLifetimeSec,
    sameSite: 'Strict',
  })
}

export const checkCookie = async (context: Context) => {
  const payload = await getPayload(context)
  // No cookies
  if (!payload)
    return context.json(null)
  const { username, role } = { ...payload }
  // Logged out
  if (!username || !role)
    return context.json(null)
  // Update and move on
  await updateCookie(context, payload)
  return context.json({ username, role })
}
