import axios from 'axios'

export const fetchOrgs = async (): Promise<APIOrg[]> => {
  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    axiosRes = await axiosInstance.get('/orgs')
  return axiosRes.data
}

export const fetchXLSX = async (
  size: number,
  page: number,
  fromDate: string,
  toDate: string,
  sortBy: string,
  desc: boolean,
): Promise<FetchXLSXResult> => {
  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    params = { size, page, fromDate, toDate, sortBy, desc },
    axiosRes = await axiosInstance.get(`/xlsx`, { params })
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
  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    params = { size, page, fromDate, toDate, sortBy, desc },
    axiosRes = await axiosInstance.get(`/reports`, { params })
  return axiosRes.data
}
