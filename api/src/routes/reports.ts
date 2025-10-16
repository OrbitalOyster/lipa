import type { Context } from 'hono'
import fs from 'node:fs'
import { parseQuery } from '../utils'
import { setTimeout as sleep } from 'node:timers/promises'

export const reports = async (context: Context) => {
  await sleep(300)

  const {
    size,
    fromDate,
    toDate,
    sortBy,
    desc,
  } = parseQuery(context, ['date', 'year'])

  const cmpr = (a, b) => {
    const order = desc ? -1 : 1
    return (a[sortBy] - b[sortBy]) * order
  }

  const placeholderRaw = fs.readFileSync('reports.json').toString()
  let rows = (JSON.parse(placeholderRaw) as APIReport[])
    .map((r: APIReport, i: number) => ({ ...r, i, date: new Date(r.date) })) // Add index, convert ISODate to date
    .filter(r => r.date > fromDate && r.date < toDate) // Filter by date
    .sort(cmpr) // Sort
  const total = rows.length

  let page = Number(context.req.query()['page']) || 0
  const totalPages = Math.ceil(total / size)
  if (totalPages === 0)
    page = 0
  else if (page >= totalPages)
    page = totalPages - 1

  rows = rows.slice(page * size, (page + 1) * size) // Get page

  return context.json(
    {
      page,
      size,
      sortBy,
      desc,
      total,
      rows,
    },
  )
}
