import type { Context, Next } from 'hono'
import { auth, logout } from './auth'
import { check, getPayload } from './cookies'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { orgs } from './orgs'
import { reports } from './reports'
import { serveStatic } from 'hono/bun'

const defaultMessage = 'Lipa API v0.0.1'

/* Config */
const port = Number(Bun.env['API_PORT']),
  origin = Bun.env['ALLOWED_ORIGIN'].split(' ')

/* Check config */
if (!Bun.env['COOKIE_NAME']
  || !Bun.env['COOKIE_SHORT_LIFETIME_SEC']
  || !Bun.env['COOKIE_LONG_LIFETIME_SEC']
  || !Bun.env['COOKIE_SECRET']
  || !Bun.env['TOKEN_SECRET']
  || !port
  || !origin
)
  throw new Error('Missing .env config')

/* App */
const app = new Hono()
/* Logger */
app.use('*', logger())

/* 404 */
const notFound = (context: Context) => context.text('Nothing here', 404)
app.notFound(notFound)

/* 500 */
app.onError((err, context: Context) => {
  console.error(err)
  return context.text('Major screw-up, check console for details', 500)
})

/* Allow cross-origin resource sharing */
app.use('*', cors({ origin, credentials: true }))
/* Stupid favicon */
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
/* Default response */
app.get('/', (context: Context) => context.text(defaultMessage))

/* User data */
app.get('/payload', async (context: Context) => context.json(await getPayload(context)))
/* Auth check */
app.get('/check', async (context: Context) => context.json(await check(context)))
/* Auth */
app.post('/auth', auth)
/* Orgs */
app.get('/orgs', orgs)

/* Auth check middleware */
const checkAuth = async (context: Context, next: Next) => {
  const authOk = await check(context)
  if (authOk)
    return await next()
  else
    return notFound(context)
}
app.use(checkAuth)

/* Reports */
app.get('/reports', reports)
/* Logout */
app.get('/logout', logout)

export default {
  fetch: app.fetch,
  port,
}
