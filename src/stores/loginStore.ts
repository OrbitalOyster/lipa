import { defineStore } from 'pinia'

interface ILoginStore {
  username: null | string
  role: null | string
}

export const useLoginStore = defineStore('login', {
  state: (): ILoginStore => ({
    username: null,
    role: null,
  }),
  actions: {
    auth(username: string, role: string) {
      this.username = username
      this.role = role
    },
    logout() {
      this.username = null
      this.role = null
    },
  },
})
