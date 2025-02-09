import { defineStore } from 'pinia'

export type FormCheck = 'required' | 'lessThanTo' | 'moreThanFrom'
export type Inputs = Record<string, string | boolean | null>

interface StoreState {
  errors: Record<string, string>
  inputs: Inputs
  checks: Record<string, FormCheck[]>
}

export const useFormStore = (id: string) => defineStore(id, {
  state: (): StoreState => ({
    errors: {},
    inputs: {},
    checks: {},
  }),
  actions: {
    checkInput(key: string, check: FormCheck) {
      const rawValue = this.inputs[key]
      switch (check) {
        case 'required':
          return !rawValue ? 'Required' : ''
        case 'lessThanTo': {
          const value = Number(rawValue),
            to = Number(this.inputs['to'])
          return value >= to ? 'Must be less than to' : ''
        }
        case 'moreThanFrom': {
          const value = Number(rawValue),
            from = Number(this.inputs['from'])
          return value <= from ? 'Must be more than from' : ''
        }
        default:
          /* Should not get here */
          return ''
      }
    },
    validate() {
      /* For every input */
      Object.keys(this.inputs).forEach((key) => {
        const checks = this.checks[key]
        /* For every check (if any) */
        checks?.every((check) => {
          this.errors[key] = this.checkInput(key, check)
          return !this.errors[key]
        })
      })
    },
    isValid() {
      return Object.values(this.errors).every(e => e === '')
    },
  },
})()
