import { defineStore } from 'pinia'

export type MyFormCheck = 'required' | 'lessThanTo' | 'moreThanFrom'

interface IState {
  errors: Record<string, string>
  inputs: Record<string, string | boolean>
  checks: Record<string, MyFormCheck[]>
}

export const useFormStore = (id: string) => defineStore(id, {
  state: (): IState => ({
    errors: {},
    inputs: {},
    checks: {},
  }),
  actions: {
    checkInput(key: string, check: MyFormCheck) {
      const rawValue = this.inputs[key]
      switch (check) {
        case 'required':
          return rawValue === '' ? 'Required' : ''
        case 'lessThanTo': {
          const value = Number(rawValue),
            to = Number(this.inputs.to)
          return value >= to ? 'Must be less than to' : ''
        }
        case 'moreThanFrom': {
          const value = Number(rawValue),
            from = Number(this.inputs.from)
          return value <= from ? 'Must be more than from' : ''
        }
        default: {
          /* Should not get here */
          return ''
        }
      }
    },
    validate() {
      /* For every input */
      Object.keys(this.inputs).forEach((key) => {
        const checks = this.checks[key]
        /* For every check */
        checks.every((check) => {
          this.errors[key] = this.checkInput(key, check)
          return this.errors[key] === ''
        })
      })
    },
    isValid() {
      return Object.values(this.errors).every(e => e === '')
    },
  },
})()
