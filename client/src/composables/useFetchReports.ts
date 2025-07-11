import axios from 'axios'

const useFetchReports = async (size: number, page: number, sortBy: string, desc: boolean): Promise<FetchReportsResult> => {
  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    params = { size, page, sortBy, desc },
    axiosRes = await axiosInstance.get(`/reports`, { params })
  return axiosRes.data
}

export default useFetchReports
