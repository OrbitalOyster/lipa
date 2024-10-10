import axios, { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'

interface ILoginStore {
  username: null | string
  role: null | string
}

interface AuthResponse {
  username: string
  role: string
}

const authEndpoint = import.meta.env.VITE_AUTH_API

export const useLoginStore = defineStore('login', {
  state: (): ILoginStore => ({
    username: null,
    role: null,
  }),
  actions: {
    async auth(username: string, password: string) {
      const res: AxiosResponse<AuthResponse | null> = await axios.post(
        authEndpoint + '/auth', {
          username,
          password,
        }, {
          withCredentials: true,
        },
      )
      if (res.data !== null) {
        this.username = res.data.username
        this.role = res.data.role
        return true
      }
      else
        return false
    },
    async check() {
      // Already logged in
      if (this.username)
        return true
      const authCheck: AxiosResponse<AuthResponse | false>
        = await axios.get(authEndpoint + '/check', { withCredentials: true })
      if (authCheck.data === false)
        return false
      this.username = authCheck.data.username
      this.role = authCheck.data.role
      return true
    },
    logout() {
      this.username = null
      this.role = null
    },
  },
})
