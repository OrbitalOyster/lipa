import { deleteCookie, getSignedCookie, setSignedCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import type { Context } from 'hono'

const cookieName = Bun.env['COOKIE_NAME'],
  cookieSecret = Bun.env['COOKIE_SECRET'],
  cookieShortLifetimeSec = Number(Bun.env['COOKIE_SHORT_LIFETIME_SEC']),
  cookieLongLifetimeSec = Number(Bun.env['COOKIE_LONG_LIFETIME_SEC']),
  tokenSecret = Bun.env['TOKEN_SECRET']

/* JWT encryption algorithm */
const alg = 'HS512'

export const getPayload = async (context: Context): Promise<Partial<UserPayload>> => {
  const cookie = await getSignedCookie(
    context,
    cookieSecret,
    cookieName,
  )

  /* No cookie / expired cookie / invalid cookie */
  if (!cookie) return {}
  const payload = await verify(
    cookie,
    tokenSecret,
    alg,
  )
  return payload
}

export const updateCookie = async (context: Context, payload?: Partial<UserPayload>) => {
  const oldPayload = await getPayload(context)
  if (payload) Object.assign(
    oldPayload,
    payload,
  )

  /* Set cookie lifetime */
  const rememberMe = oldPayload.rememberMe
      ? true
      : false,
    maxAge = rememberMe
      ? cookieLongLifetimeSec
      : cookieShortLifetimeSec

  /* Update expiration date */
  oldPayload.exp = Math.floor(Date.now() / 1000) + maxAge
  await setSignedCookie(
    context,
    cookieName,
    await sign(
      oldPayload,
      tokenSecret,
      alg,
    ),
    cookieSecret,
    {
      path: '/',
      httpOnly: true,
      maxAge,
      sameSite: 'Strict',
    },
  )
}

export const check = async (context: Context) => {
  const payload = await getPayload(context)

  /* Not logged in */
  if (!payload.userId) return false
  const { userId } = { ...payload }

  /* Logged out */
  if (!userId) return false

  /* Update cookie and move on */
  await updateCookie(context)
  return true
}

export const clearCookie = (context: Context) => {
  deleteCookie(
    context,
    cookieName,
  )
}
