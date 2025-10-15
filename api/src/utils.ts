import type { Context } from 'hono'

/*
 * size
 * page
 * fromDate
 * toDate
 * sortBy
 * desc
 */

const maxSize = 100,
  defaultSort = 'date',
  defaultFromDate = '2025-01-01',
  defaultToDate = '2025-12-01'

export const parseQuery = (context: Context, sortable: string[], outOf: number) => {
  /* Raw query */
  let size = Number(context.req.query()['size']) || 10,
    page = Number(context.req.query()['page']) || 0,
    fromDate: string | Date = context.req.query()['fromDate'] || defaultFromDate,
    toDate: string | Date = context.req.query()['toDate'] || defaultToDate,
    sortBy = context.req.query()['sortBy'],
    desc: string | boolean = context.req.query()['desc'] || 'false'
  /* Validate size */
  if (size > maxSize)
    size = maxSize
  /* Validate page */
  const totalPages = Math.ceil(outOf / size)
  if (totalPages === 0)
    page = 0
  else if (page >= totalPages)
    page = totalPages - 1
  /* Validate sortBy */
  if (!sortBy || !sortable.includes(sortBy))
    sortBy = defaultSort
  /* Validate desc */
  try {
    desc = !!JSON.parse(desc.toLowerCase()) /* "true" => true */
  }
  catch (err) {
    console.log('Haxxor alert!')
  }
  /* Validate dates */
  fromDate = new Date(fromDate)
  if (fromDate.toJSON() === null)
    fromDate = new Date(defaultFromDate)
  toDate = new Date(toDate)
  if (toDate.toJSON() === null)
    toDate = new Date(defaultToDate)
  toDate.setDate(toDate.getDate() + 1)

  return {
    size,
    page,
    fromDate,
    toDate,
    sortBy,
    desc,
  }
}
