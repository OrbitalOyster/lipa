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
    role: null | string
    selectedOrgs: string[]
    sideBarWidth: number
    username: null | string
  }

  /* Accordion */
  interface AccordionItem {
    icon: IconDefinition
    id: string
    title: string
  }

  interface Accordion {
    items: AccordionItem[]
    opened: string
  }

  /* Tabs */
  interface TabSlot {
    icon: IconDefinition
    id: string
    title: string
  }

  /* Tree */
  interface TreeLeaf {
    checked: Ref<boolean>
    id: string
    matched?: boolean
    sub: TreeLeaf[]
    title: string
    opened: Ref<boolean>
  }

  /* FloatingUI options */
  interface FloatingUIOptions {
    active: Ref<boolean>
    fitTargetWidth?: boolean
    side?: Side
  }

  /* Login form */
  interface LoginFormCheck {
    password: string
    rememberMe: boolean
    username: string
  }
}
