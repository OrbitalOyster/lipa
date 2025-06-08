import axios from 'axios'

const useFetchOrgs = async () => {
  const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URI }),
    axiosRes = await axiosInstance.get('/orgs'),
    apiOrgs: ApiOrg[] = axiosRes.data
    return apiOrgs
}

export default useFetchOrgs
