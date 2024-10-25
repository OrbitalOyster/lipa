import { defineStore } from 'pinia'

interface IFormStore {
  errors: Record<string, string>
  inputs: Record<string, string | boolean>
  checks: Record<string, string[]>
}

export const useFormStore = (id: string) => defineStore(id, {
  state: (): IFormStore => ({
    errors: {},
    inputs: {},
    checks: {},
  }),
  actions: {
    validate() {
      let result = true
      Object.keys(this.inputs).forEach((key) => {
        const value = this.inputs[key],
          checks = this.checks[key]
        this.errors[key] = ''

        if (!checks.length) {
          return
        }

        /* Required */
        if (checks.includes('required')) {
          if (!value) {
            this.errors[key] = 'Value required'
            result = false
            return
          }
        }

        /* Less than 'to' */
        if (checks.includes('lessThanTo')) {
          if (!this.inputs.to || Number(value) >= Number(this.inputs.to)) {
            this.errors[key] = 'Must be less than to'
            result = false
            return
          }
        }

        /* More than 'from' */
        if (checks.includes('moreThanFrom')) {
          if (!this.inputs.from || Number(value) <= Number(this.inputs.from)) {
            this.errors[key] = 'Must be more than from'
            result = false
          }
        }
      })

      return result
    },
  },
})()
