import { defineStore } from 'pinia'

export const useFormStore = (id: string) => defineStore(id, {
  state: () => ({
    myChecks: {},
    myInputs: {},
  }),
})()
