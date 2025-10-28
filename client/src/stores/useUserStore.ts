import axios from 'axios'
import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    userId: null,
    isOrg: null,
    name: null,
    role: null,
    rememberMe: false,
  }),
  actions: {
    async getPayload() {
      const payload = await axios.get('/payload').then(res => res.data)
      if (payload)
        Object.assign(this, payload)
    },
    /* Checks if user's logged in */
    async check() {
      /* Already logged in */
      if (this.userId)
        return true
      try {
        return await axios.get('/check').then(res => res.data)
      }
      catch (err) {
        throw new Error(`Auth service error: ${(err as Error).toString()}`)
      }
    },
    /* Logs user in */
    async auth(userId: string, isOrg: boolean, password: string, rememberMe: boolean) {
      const success = await axios.post(
        '/auth', {
          userId,
          isOrg,
          password,
          rememberMe,
        },
      ).then(res => res.data)
      /* Failed login */
      if (!success)
        return false
      await this.getPayload()
      return true
    },
    async logout() {
      await axios.get('/logout')
      this.userId = null
      this.isOrg = null
      this.name = null
      this.role = null
    },
  },
})

export { useUserStore }
