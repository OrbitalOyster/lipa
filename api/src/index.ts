import type { Context, Next } from 'hono'
import { auth, logout } from './routes/auth'
import { check, getPayload } from './routes/cookies'
import { checkFilenameExists, download, save, sync, upload, xlsx, xlsxByHash, xlsxDelete } from './routes/xlsx'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { orgs } from './routes/orgs'
import { reports } from './routes/reports'
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
) throw new Error('Missing .env config')

/* App */
const app = new Hono()

/* Logger */
app.use(
  '*',
  logger(),
)

/* 404 */
const notFound = (context: Context) => context.text(
  'Nothing here',
  404,
)
app.notFound(notFound)

/* 500 */
app.onError((err, context: Context) => {
  console.error(err)
  return context.text(
    'Major screw-up, check console for details',
    500,
  )
})

/* Allow cross-origin resource sharing */
app.use(
  '*',
  cors({ origin,
    credentials: true }),
)

/* Stupid favicon */
app.use(
  '/favicon.ico',
  serveStatic({ path: './favicon.ico' }),
)

/* Default response */
app.get(
  '/',
  (context: Context) => context.text(defaultMessage),
)

/* Sanitized user data */
app.get(
  '/payload',
  async (context: Context) => {
    const payload = await getPayload(context),
      { exp, rememberMe, ...sanitizedPayload } = payload /* Voodoo */
    return context.json(sanitizedPayload)
  },
)

/* Auth check */
app.get(
  '/check',
  async (context: Context) => context.json(await check(context)),
)

/* Auth */
app.post(
  '/auth',
  auth,
)

/* Orgs */
app.get(
  '/orgs',
  orgs,
)

/* Auth check middleware */
const checkAuth = async (context: Context, next: Next) => {
  const authOk = await check(context)
  if (authOk) return await next()
  else return notFound(context)
}
app.use(checkAuth)

/* XLSX templates */
app.get(
  '/xlsx',
  xlsx,
)
app.get(
  '/xlsx/:hash',
  xlsxByHash,
)
app.post(
  '/xlsx',
  upload,
)
app.get(
  '/xlsx/:hash/download',
  download,
)
app.post(
  '/save',
  save,
)
app.delete(
  '/xlsx/:hash',
  xlsxDelete,
)

/* Sync DB state and actual files */
app.get(
  '/sync',
  sync,
)

app.get(
  '/check-filename',
  async (context: Context) => {
    const filename = context.req.query()['q']
    if (!filename) return context.json(
      'Filename required',
      400,
    )
    return context.json(await checkFilenameExists(filename))
  },
)

/* Reports */
app.get(
  '/reports',
  reports,
)

/* Logout */
app.get(
  '/logout',
  logout,
)

export default {
  fetch: app.fetch,
  port,
}
