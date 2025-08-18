import type { Context } from 'hono'
import fs from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'

const maxSize = 100,
  defaultSort = 'date'

// TODO: tmp
// const total = 500

export const reports = async (context: Context) => {
  await sleep(300)

  /* Query params */
  let size = Number(context.req.query()['size']) || 10,
    page = Number(context.req.query()['page']) || 0,
    fromDate = context.req.query()['fromDate'],
    toDate = context.req.query()['toDate'],
    sortBy = context.req.query()['sortBy']
  const descStr = context.req.query()['desc'] || 'false'

  if (size > maxSize)
    size = maxSize

  if (!sortBy || !(['date', 'year'].includes(sortBy)))
    sortBy = defaultSort

  let desc = false
  try {
    desc = JSON.parse(descStr.toLowerCase())
  }
  catch (error) {
    console.log('Haxxor alert!')
  }

  /* TODO: Validate */
  fromDate = new Date(fromDate)
  toDate = new Date(toDate)
  toDate.setDate(toDate.getDate() + 1)

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
