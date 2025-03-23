import { auth, logout } from './auth'
import { check, getPayload, setPayload } from './cookies'
import { orgs } from './orgs'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

/* Config */
const port = Number(Bun.env['API_PORT']),
  origin = Bun.env['ALLOWED_ORIGIN'].split(' ')

/* Check config */
if (!Bun.env['COOKIE_NAME']
  || !Bun.env['COOKIE_LIFETIME_SEC']
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

app.post('/payload', setPayload)

/* Auth check */
app.get('/check', check)
/* Auth */
app.post('/auth', auth)
/* Logout */
app.get('/logout', logout)

/* Orgs */
app.get('/orgs', orgs)

export default {
  fetch: app.fetch,
  port,
}
