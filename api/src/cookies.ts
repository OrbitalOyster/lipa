import { getSignedCookie, setSignedCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import type { Context } from 'hono'

const cookieName = Bun.env['COOKIE_NAME'],
  cookieSecret = Bun.env['COOKIE_SECRET'],
  cookieShortLifetimeSec = Number(Bun.env['COOKIE_SHORT_LIFETIME_SEC']),
  cookieLongLifetimeSec = Number(Bun.env['COOKIE_LONG_LIFETIME_SEC']),
  tokenSecret = Bun.env['TOKEN_SECRET']

export const getPayload = async (context: Context) => {
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
  const oldPayload = await getPayload(context)
  if (payload)
    Object.assign(oldPayload, payload)
  const rememberMe = oldPayload.rememberMe,
    maxAge = rememberMe ? cookieLongLifetimeSec : cookieShortLifetimeSec
  /* Update expiration date */
  oldPayload['exp'] = Math.floor(Date.now() / 1000) + maxAge
  await setSignedCookie(
    context,
    cookieName,
    await sign(oldPayload, tokenSecret),
    cookieSecret, {
      path: '/',
      httpOnly: true,
      maxAge,
      sameSite: 'Strict',
    })
}

export const setPayload = async (context: Context) => {
  const payload = await context.req.json<UserPayload>()
  if (payload.username || payload.orgId || payload.exp)
    throw new Error('Haxxor alert')
  await updateCookie(context, payload)
  return context.json(payload)
}

export const check = async (context: Context) => {
  const payload = await getPayload(context)
  /* No cookies */
  if (!payload)
    return context.json(false)
  const { username } = { ...payload }
  /* Logged out */
  if (!username)
    return context.json(false)
  /* Update and move on */
  await updateCookie(context)
  return context.json(true)
}
