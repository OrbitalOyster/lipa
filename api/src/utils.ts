import type { Context } from 'hono'

const maxSize = 100,
  defaultSort = 'date',
  defaultFromDate = '2025-01-01',
  defaultToDate = '2025-12-31'

export const getMySQLDate = (date: Date) => {
  return date.toISOString().slice(
    0,
    19,
  )
    .replace(
      'T',
      ' ',
    )
}

export const parseQuery = (context: Context, sortable: string[]) => {
  /* Raw query */
  const query = context.req.query()
  let size = Number(query['size']) || 10,
    // page = Number(query()['page']) || 0,
    fromDate: string | Date = query['fromDate'] || defaultFromDate,
    toDate: string | Date = query['toDate'] || defaultToDate,
    sortBy = query['sortBy'],
    desc: string | boolean = query['desc'] || 'false'

  /* Validate size */
  if (size > maxSize) size = maxSize

  /* Validate page */
  /*
     * const totalPages = Math.ceil(outOf / size)
     * if (totalPages === 0)
     *   page = 0
     * else if (page >= totalPages)
     *   page = totalPages - 1
     */
  /* Validate sortBy */
  if (!sortBy || !sortable.includes(sortBy)) sortBy = defaultSort

  /* Validate desc */
  try {
    desc = !!JSON.parse(desc.toLowerCase()) /* "true" => true */
  }
  catch (err) {
    console.log('Haxxor alert!')
  }

  /* Validate dates */
  fromDate = new Date(fromDate)
  if (fromDate.toJSON() === null) fromDate = new Date(defaultFromDate)
  toDate = new Date(toDate)
  if (toDate.toJSON() === null) toDate = new Date(defaultToDate)
  toDate.setDate(toDate.getDate() + 1)

  /* Done */
  return {
    size,
    // page,
    fromDate,
    toDate,
    sortBy,
    desc,
  }
}
