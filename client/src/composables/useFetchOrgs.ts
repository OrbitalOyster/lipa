import axios from 'axios'

const useFetchOrgs = async (): Promise<ApiOrg[]> => {
  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    axiosRes = await axiosInstance.get('/orgs')
  return axiosRes.data
}

export default useFetchOrgs
