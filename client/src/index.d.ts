import type { IconDefinition } from '@fortawesome/fontawesome-common-types'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

declare global {
  /* Form store */
  type FormCheck = 'required' | 'lessThanTo' | 'moreThanFrom' | 'notBogus'
  type FormInput = string | boolean | null

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
    checked: boolean
    matched?: boolean
    toggled: boolean
    sub?: GooseTreeLeaf[]
  }

  /* Login form */
  interface LoginFormCheck {
    username: string
    password: string
    rememberMe: boolean
  }
}
