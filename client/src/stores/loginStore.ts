import axios, { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'

interface ILoginStore {
  username: null | string
  role: null | string
}

interface IAuthResponse {
  username: string
  role: string
}

const axiosOptions = { withCredentials: true },
  authEndpoint = import.meta.env.VITE_AUTH_API

if (!authEndpoint) {
  throw new Error('Missing auth endpoint')
}

export default defineStore('login', {
  state: (): ILoginStore => ({
    username: null,
    role: null,
  }),
  actions: {
    async check() {
      /* Already logged in */
      if (this.username) {
        return true
      }
      const res: AxiosResponse<IAuthResponse | null>
        = await axios.get(`${authEndpoint}/check`, axiosOptions)
      /* Invalid token */
      if (res.data === null) {
        return false
      }
      this.username = res.data.username
      this.role = res.data.role
      return true
    },
    async auth(username: string, password: string) {
      const res: AxiosResponse<IAuthResponse | null> = await axios.post(
        `${authEndpoint}/auth`, {
          username,
          password,
        }, axiosOptions,
      )
      /* Failed login */
      if (res.data === null) {
        return false
      }
      this.username = res.data.username
      this.role = res.data.role
      return true
    },
    async logout() {
      await axios.get(`${authEndpoint}/logout`, axiosOptions)
      this.username = null
      this.role = null
    },
  },
})
