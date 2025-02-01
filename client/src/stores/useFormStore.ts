import { defineStore } from 'pinia'

export type FormCheck = 'required' | 'lessThanTo' | 'moreThanFrom'
export type Inputs = Record<string, string | boolean | null>

interface StoreState {
  errors: Record<string, string>
  inputs: Inputs
  checks: Record<string, FormCheck[]>
}

function checkInput(key: string, check: FormCheck, inputs: Inputs) {
  const rawValue = inputs[key]
  switch (check) {
    case 'required':
      return !rawValue ? 'Required' : ''
    case 'lessThanTo': {
      const value = Number(rawValue),
        to = Number(inputs['to'])
      return value >= to ? 'Must be less than to' : ''
    }
    case 'moreThanFrom': {
      const value = Number(rawValue),
        from = Number(inputs['from'])
      return value <= from ? 'Must be more than from' : ''
    }
    default:
      /* Should not get here */
      return ''
  }
}

export const useFormStore = (id: string) => defineStore(id, {
  state: (): StoreState => ({
    errors: {},
    inputs: {},
    checks: {},
  }),
  actions: {
    checkInput,
    validate() {
      /* For every input */
      Object.keys(this.inputs).forEach((key) => {
        const checks = this.checks[key]
        const inputs = this.inputs
        /* For every check (if any) */
        checks?.every((check) => {
          this.errors[key] = this.checkInput(key, check, inputs)
          return !this.errors[key]
        })
      })
    },
    isValid() {
      return Object.values(this.errors).every(e => e === '')
    },
    reset() {
      Object.keys(this.inputs).forEach(key => delete this.inputs[key])
    },
  },
})()
