import axios from 'axios'

const useFetchReports = async (size: number, page: number): Promise<ApiOrg[]> => {
  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    params = { size, page },
    axiosRes = await axiosInstance.get(`/reports`, { params })
  return axiosRes.data
}

export default useFetchReports
