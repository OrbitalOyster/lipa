import { checkCookie, clearCookie } from './cookies'
import { Hono } from 'hono'
import { auth } from './auth'
import { cors } from 'hono/cors'

// Config
const port = Number(Bun.env['API_PORT']),
  origin = Bun.env['ALLOWED_ORIGIN'].split(' ')

// Check config
if (!Bun.env['COOKIE_NAME']
  || !Bun.env['COOKIE_LIFETIME_SEC']
  || !Bun.env['COOKIE_SECRET']
  || !Bun.env['TOKEN_SECRET']
  || !port
  || !origin
)
  throw new Error('Missing .env config')

// App
const app = new Hono()
// Allow cross-origin resource sharing
app.use('*', cors({ origin, credentials: true }))
// Default response
app.get('/', c => c.text('You\'re doing it wrong\n'))
// Cookie check
app.get('/check', checkCookie)
// Auth
app.post('/auth', auth)
app.get('/logout', clearCookie)

export default {
  fetch: app.fetch,
  port,
}
