import { Hono } from 'hono'

// Config
const cookieName = process.env.COOKIE_NAME
const cookieSecret = process.env.COOKIE_SECRET
const tokenSecret = process.env.TOKEN_SECRET
const port = process.env.PORT

const app = new Hono()

app.get('/', (c) => {
  return c.json('Lipa API')
})

export default {
  fetch: app.fetch,
  port
}

// bun run --hot index.ts
