import { defineStore } from 'pinia'

export const useFormStore = (id: string) => defineStore(id, {
  state: () => ({
    errors: {},
    inputs: {},
    checks: [],
  }),
  actions: {
    validate() {
      let result = true
      Object.keys(this.inputs).forEach(key => {
        const value = this.inputs[key]
        const checks = this.checks[key]
        this.errors[key] = ''

        if (!checks.length)
          return

        /* Required */
        if (checks.includes('required') && !value) {
          this.errors[key] = 'Value required'
          result = false
          return
        }

        /* Less than 'to' */
        if (checks.includes('lessThanTo') && Number(value) >= Number(this.inputs.to)) {
          this.errors[key] = 'Must be less than to'
          result = false
          return
        }

        /* More than 'from' */
        if (checks.includes('moreThanFrom') && Number(value) <= Number(this.inputs.from)) {
          this.errors[key] = 'Must be more than from'
          result = false
          return
        }

      })
      return result
    }
  }
})()
