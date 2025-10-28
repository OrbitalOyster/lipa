import axios from 'axios'

const apiEndpoint = import.meta.env.VITE_API_URI,
  axiosInstance = axios.create({ baseURL: apiEndpoint })

if (!apiEndpoint)
  throw new Error('Missing api endpoint')

export { apiEndpoint, axiosInstance }
