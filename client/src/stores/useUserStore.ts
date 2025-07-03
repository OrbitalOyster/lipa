import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { defineStore } from 'pinia'

const apiEndpoint = import.meta.env.VITE_API_URI

if (!apiEndpoint)
  throw new Error('Missing api endpoint')

const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    userId: null,
    isOrg: null,
    role: null,
    rememberMe: false,
  }),
  actions: {
    async getPayload() {
      const res = await axios.get(`${apiEndpoint}/payload`)
      if (res.data)
        Object.assign(this, res.data)
    },
    async setPayload(payload) {
      const res = await axios.post(`${apiEndpoint}/payload`, payload)
      if (res.data)
        Object.assign(this, res.data)
    },
    /* Checks if user's logged in */
    async check() {
      /* Already logged in */
      if (this.userId)
        return true
      try {
        const res: AxiosResponse<boolean>
          = await axios.get(`${apiEndpoint}/check`)
        return (res.data)
      }
      catch (err) {
        throw new Error(`Auth service error: ${(err as Error).toString()}`)
      }
    },
    /* Logs user in */
    async auth(userId: string, isOrg: boolean, password: string, rememberMe: boolean) {
      const res: AxiosResponse<boolean> = await axios.post(
        `${apiEndpoint}/auth`, {
          userId,
          isOrg,
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
      await axios.get(`${apiEndpoint}/logout`)
      this.userId = null
      this.isOrg = null
      this.role = null
    },
  },
})

export { useUserStore }
