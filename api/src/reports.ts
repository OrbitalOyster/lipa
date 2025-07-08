import type { Context } from 'hono'
import fs from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'

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

const maxSize = 100

export const reports = async (context: Context) => {
  await sleep(1500)

  // TODO: tmp
  const total = 500

  /* Query params */
  let size = Number(context.req.query()['size']) || 10,
    page = Number(context.req.query()['page']) || 0

  if (size > maxSize)
    size = maxSize

  const totalPages = Math.ceil(total / size)
  if (page > totalPages)
    page = totalPages - 1

  const placeholderRaw = fs.readFileSync('reports.json').toString(),
    rows = (JSON.parse(placeholderRaw) as APIReport[])
      .map((r: APIReport, i: number) => ({ ...r, i })) // Add index
      .slice(page * size, (page + 1) * size) // Get page

  return context.json(
    {
      page,
      size,
      total,
      rows,
    },
  )
}
