import axios from 'axios'

export const fetchXLSX = async (
  size: number,
  page: number,
  fromDate: string,
  toDate: string,
  sortBy: string,
  desc: boolean,
): Promise<FetchXLSXResult> => {
  const params = { size, page, fromDate, toDate, sortBy, desc },
    axiosRes = await axios.get('/xlsx', { params })
  return axiosRes.data
}

export const fetchReports = async (
  size: number,
  page: number,
  fromDate: string,
  toDate: string,
  sortBy: string,
  desc: boolean,
): Promise<FetchReportsResult> => {
  const params = { size, page, fromDate, toDate, sortBy, desc },
    axiosRes = await axios.get('/reports', { params })
  return axiosRes.data
}
