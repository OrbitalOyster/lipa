import type { Context } from 'hono'
import { setTimeout as sleep } from 'node:timers/promises'
import fs from 'node:fs'

/*
interface ReportsQuery {
  n?: string
  page?: string
}
*/

interface APIReport {
  date: string
  org: string
  year: number
  status: string
}

export const reports = async (context: Context) => {
  await sleep(500)
  /* Query params */
  const n = Number(context.req.query()['n']),
    page = Number(context.req.query()['page'])

  const placeholderRaw = fs.readFileSync('reports.json').toString(),
    json = (JSON.parse(placeholderRaw) as APIReport[])
      .map((r: APIReport, i: number) => ({ ...r, i })) // Add index
      .slice(page * n, (page + 1) * n) // Get page

  return context.json(json)
}
