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
  /* No cookie */
  if (!cookie)
    return {}
  const payload = await verify(cookie, tokenSecret),
    { exp, ...sanitizedPayload } = payload // Voodoo
  return sanitizedPayload
}

export const updateCookie = async (context: Context, payload?: UserPayload) => {
  const cookieName = Bun.env['COOKIE_NAME'],
    cookieSecret = Bun.env['COOKIE_SECRET'],
    cookieLifetimeSec = Number(Bun.env['COOKIE_LIFETIME_SEC']),
    tokenSecret = Bun.env['TOKEN_SECRET']
  const oldPayload = await getPayload(context),
    newPayload = Object.assign(oldPayload, payload || {})
  newPayload.exp = Math.floor(Date.now() / 1000) + cookieLifetimeSec
  const token = await sign(newPayload, tokenSecret)
  await setSignedCookie(context, cookieName, token, cookieSecret, {
    path: '/',
    httpOnly: true,
    maxAge: cookieLifetimeSec,
    sameSite: 'Strict',
  })
}

export const setPayload = async (context: Context) => {
  const payload = await context.req.json<UserPayload>()
  if (payload.username || payload.role || payload.exp)
    throw new Error('Haxxor alert')
  await updateCookie(context, payload)
  return context.json(payload)
}

export const check = async (context: Context) => {
  const payload = await getPayload(context)
  /* No cookies */
  if (!payload)
    return context.json(false)
  const { username, role } = { ...payload }
  /* Logged out */
  if (!username || !role)
    return context.json(false)
  /* Update and move on */
  await updateCookie(context)
  return context.json(true)
}
