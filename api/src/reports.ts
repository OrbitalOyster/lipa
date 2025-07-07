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
  const size = Number(context.req.query()['size']),
    page = Number(context.req.query()['page'])

  const placeholderRaw = fs.readFileSync('reports.json').toString(),
    rows = (JSON.parse(placeholderRaw) as APIReport[])
      .map((r: APIReport, i: number) => ({ ...r, i })) // Add index
      .slice(page * size, (page + 1) * size) // Get page

  return context.json(
    {
      page, size, total: 500,
      rows
    }
  )
}
