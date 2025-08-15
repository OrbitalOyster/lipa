import axios from 'axios'

const useFetchReports = async (size: number, page: number, fromDate: string, toDate: string, sortBy: string, desc: boolean): Promise<FetchReportsResult> => {
  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    params = { size, page, fromDate, toDate, sortBy, desc },
    axiosRes = await axiosInstance.get(`/reports`, { params })
  return axiosRes.data
}

export default useFetchReports
