import type { Context } from 'hono'
// import { setTimeout as sleep } from 'node:timers/promises'
import fs from 'node:fs'

export const reports = async (context: Context) => {
  /* Query params */
  let { n, page } = context.req.query()
  n = Number(n)
  page = Number(page)

  const placeholderRaw = fs.readFileSync('reports.json'),
    json = JSON.parse(placeholderRaw)
      .map((r, i) => ({...r, i})) // Add index
      .slice(page * n, (page + 1) * n) // Get page

  return context.json(json)
}
