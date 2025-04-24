import type { IconDefinition } from '@fortawesome/fontawesome-common-types'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

declare global {
  /* Forms */
  type FormInputValidity = 'valid' | 'invalid'

  /* Form store */
  type FormCheck = 'required' | 'lessThanTo' | 'moreThanFrom'
  type FormInputs = Record<string, string | boolean | null>

  interface StoreState {
    errors: Record<string, string>
    inputs: FormInputs
    checks: Record<string, FormCheck[]>
  }

  /* User store */
  interface UserStore {
    username: null | string
    role: null | string
    sideBarWidth: number
    selectedOrgs: string[]
  }

  /* Accordion */
  interface AccordionItem {
    id: string
    title: string
    icon: IconDefinition
  }

  interface Accordion {
    items: AccordionItem[]
    toggled: string
  }

  /* Tabs */
  interface TabSlot {
    id: string
    title: string
    icon: IconDefinition
  }

  /* Tree */
  interface GooseTreeLeaf {
    id: string
    title: string
    checked: boolean | null
    matched?: boolean
    toggled: boolean
    sub?: GooseTreeLeaf[]
  }
}
