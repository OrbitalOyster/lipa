import { auth, logout } from './auth'
import { check, getPayload, setPayload } from './cookies'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { orgs } from './orgs'
import { reports } from './reports'

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
/* Allow cross-origin resource sharing */
app.use('*', cors({ origin, credentials: true }))
/* Default response */
app.get('/', c => c.text('You\'re doing it wrong\n'))

/* User data */
app.get('/payload', async c => c.json(await getPayload(c)))

// app.post('/payload', setPayload)

/* Auth check */
app.get('/check', check)
/* Auth */
app.post('/auth', auth)
/* Logout */
app.get('/logout', logout)

/* Orgs */
app.get('/orgs', orgs)
/* Reports */
app.get('/reports', reports)

export default {
  fetch: app.fetch,
  port,
}
