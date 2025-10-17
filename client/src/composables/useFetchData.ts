import axios from 'axios'

export const useFetchTemplates = async (size: number, page: number, fromDate: string, toDate: string, sortBy: string, desc: boolean): Promise<FetchTemplatesResult> => {
  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    params = { size, page, fromDate, toDate, sortBy, desc },
    axiosRes = await axiosInstance.get(`/templates`, { params })
  return axiosRes.data
}
