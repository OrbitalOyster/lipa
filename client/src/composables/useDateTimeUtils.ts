/* new Date() -> '2025-10-16' */
export const dateToYYYYMMDD = (d: Date) => {
  const offset = d.getTimezoneOffset(),
    zeroDate = new Date(d.getTime() - offset * 60 * 1000) /* Hatred */
  return zeroDate.toISOString().substring(0, 10)
}

export const dateToPeriod = (date: Date, period: Period) => {
  const year = date.getFullYear(),
    month = date.getMonth(),
    day = date.getDate()

  let fromDate, toDate

  switch (period) {
    case 'currentMonth':
      fromDate = dateToYYYYMMDD(new Date(year, month, 1))
      toDate = dateToYYYYMMDD(new Date(year, month + 1, 0))
      break

    case 'previousMonth':
      fromDate = dateToYYYYMMDD(new Date(year, month - 1, 1))
      toDate = dateToYYYYMMDD(new Date(year, month, 0))
      break

    case 'today':
      fromDate = dateToYYYYMMDD(new Date(year, month, day))
      toDate = dateToYYYYMMDD(new Date(year, month, day))
      break

    case 'yesterday':
      fromDate = dateToYYYYMMDD(new Date(year, month, day - 1))
      toDate = dateToYYYYMMDD(new Date(year, month, day - 1))
      break

    case 'fromJan1':
      fromDate = dateToYYYYMMDD(new Date(year, 0, 1))
      toDate = dateToYYYYMMDD(new Date(year, month, day))
      break

    case 'all':
      fromDate = dateToYYYYMMDD(new Date(2000, 0, 1))
      toDate = dateToYYYYMMDD(new Date(year, month, day))
      break
  }

  return { fromDate, toDate }
}
