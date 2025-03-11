import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { defineStore } from 'pinia'

interface UserStore {
  username: null | string
  role: null | string
  sideBarWidth: number
}

const authEndpoint = import.meta.env.VITE_AUTH_API

if (!authEndpoint)
  throw new Error('Missing auth endpoint')

const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    username: null,
    role: null,
    sideBarWidth: 25
  }),
  actions: {
    async getPayload() {
      const res = await axios.get(`${authEndpoint}/payload`)
      if (res.data)
        Object.assign(this, res.data)
    },
    async setPayload(payload) {
      const res = await axios.post(`${authEndpoint}/payload`, payload)
      if (res.data)
        Object.assign(this, res.data)
    },
    /* Checks if user's logged in */
    async check() {
      /* Already logged in */
      if (this.username)
        return true
      try {
        const res: AxiosResponse<boolean>
          = await axios.get(`${authEndpoint}/check`)
        return (res.data)
      }
      catch (err) {
        throw new Error(`Auth service error: ${err.toString()}`)
      }
    },
    /* Logs user in */
    async auth(username: string, password: string, rememberMe: boolean) {
      const res: AxiosResponse<boolean> = await axios.post(
        `${authEndpoint}/auth`, {
          username,
          password,
          rememberMe,
        },
      )
      /* Failed login */
      if (!res.data)
        return false
      await this.getPayload()
      return true
    },
    async logout() {
      await axios.get(`${authEndpoint}/logout`)
      this.username = null
      this.role = null
    },
  },
})

export { useUserStore }
